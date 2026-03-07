from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64, tempfile, os, uuid, time
import logging
from garminconnect import Garmin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://garmin-body-fit.vercel.app", 
    ],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Almacén de sesiones en memoria
# { session_id: { "client": Garmin, "created": timestamp, "needs_mfa": bool } }
sessions = {}

def cleanup_sessions():
    """Eliminar sesiones expiradas (>10 minutos)"""
    now = time.time()
    expired = [k for k, v in sessions.items() if now - v["created"] > 600]
    for k in expired:
        logger.info(f"Cleaning up expired session: {k}")
        sessions.pop(k, None)

# ─── Modelos ────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyRequest(BaseModel):
    session_id: str
    mfa_code: str

class UploadRequest(BaseModel):
    session_id: str
    fit_bytes_base64: str

# ─── Endpoints ──────────────────────────────────────────────────

@app.post("/api/garmin/login")
async def login(req: LoginRequest):
    cleanup_sessions()
    try:
        logger.info(f"Login attempt for: {req.email}")
        client = Garmin(req.email, req.password)

        try:
            # Intento de login sin MFA
            client.login()

            # Si llega aquí: login exitoso sin MFA
            session_id = str(uuid.uuid4())
            sessions[session_id] = {
                "client": client, 
                "created": time.time(),
                "needs_mfa": False
            }
            logger.info(f"Login successful (No MFA) for {req.email}. Session: {session_id}")

            return {
                "status": "success",
                "session_id": session_id,
                "message": "Login exitoso"
            }

        except Exception as e:
            error_str = str(e).lower()
            logger.warning(f"Initial login failed, checking for MFA: {error_str}")

            # Detectar si necesita MFA
            if any(term in error_str for term in ["mfa", "2fa", "factor", "code", "verification"]):
                session_id = str(uuid.uuid4())
                sessions[session_id] = {
                    "client": client,
                    "created": time.time(),
                    "needs_mfa": True
                }
                logger.info(f"MFA required for {req.email}. Session created: {session_id}")
                return {
                    "status": "needs_mfa",
                    "session_id": session_id,
                    "message": "Se requiere código de verificación"
                }

            logger.error(f"Login failed: {str(e)}")
            
            # Simplified error for invalid credentials
            if "401" in error_str or "unauthorized" in error_str:
                raise HTTPException(status_code=401, detail="Credenciales incorrectas o se requiere verificación adicional")
            
            raise HTTPException(status_code=401, detail=f"Login fallido: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error in /login")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/garmin/verify")
async def verify_mfa(req: VerifyRequest):
    session = sessions.get(req.session_id)
    if not session:
        logger.warning(f"Session {req.session_id} not found in /verify")
        raise HTTPException(status_code=404, detail="Sesión no encontrada o expirada")

    try:
        logger.info(f"Verifying MFA for session: {req.session_id}")
        client = session["client"]
        # Resume login with the MFA code
        # Note: garth handles this under the hood in garminconnect
        client.resume_login(req.mfa_code)

        # MFA verificado, sesión lista
        sessions[req.session_id]["needs_mfa"] = False
        logger.info(f"MFA verification successful for session: {req.session_id}")

        return {
            "status": "success",
            "message": "Verificación correcta"
        }

    except Exception as e:
        logger.error(f"MFA verification failed for session {req.session_id}: {e}")
        raise HTTPException(status_code=401, detail=f"Código incorrecto: {str(e)}")


@app.post("/api/garmin/upload")
async def upload_fit(req: UploadRequest):
    session = sessions.get(req.session_id)
    if not session:
        logger.warning(f"Session {req.session_id} not found in /upload")
        raise HTTPException(status_code=404, detail="Sesión no encontrada o expirada")

    if session.get("needs_mfa"):
        logger.warning(f"Attempted upload on session {req.session_id} without MFA verification")
        raise HTTPException(status_code=403, detail="Verificación MFA pendiente")

    tmp_path = None
    try:
        logger.info(f"Uploading FIT for session: {req.session_id}")
        client = session["client"]
        fit_bytes = base64.b64decode(req.fit_bytes_base64)

        with tempfile.NamedTemporaryFile(suffix=".fit", delete=False) as f:
            f.write(fit_bytes)
            tmp_path = f.name

        client.upload_activity(tmp_path)
        logger.info(f"FIT uploaded successfully for session: {req.session_id}")

        # Limpiar sesión tras upload exitoso
        sessions.pop(req.session_id, None)

        return {"status": "success", "message": "¡Datos subidos a Garmin Connect!"}

    except Exception as e:
        logger.exception(f"Upload failed for session {req.session_id}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
