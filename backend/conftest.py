import os
import sys
import httpx

# Fix Starlette TestClient compatibility with httpx >= 0.28.0
_orig_httpx_init = httpx.Client.__init__

def _patched_httpx_init(self, *args, **kwargs):
    if "app" in kwargs:
        app = kwargs.pop("app")
        if "transport" not in kwargs or kwargs["transport"] is None:
            kwargs["transport"] = httpx.ASGITransport(app=app)
    _orig_httpx_init(self, *args, **kwargs)

httpx.Client.__init__ = _patched_httpx_init

# Ensure backend root is on sys.path for pytest
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
