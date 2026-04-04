"""Shared utilities for TTS backends."""
import os
import subprocess
import time
import functools


def check_resume(part_file):
    """Check if a part file exists and return its duration, or None."""
    if not os.path.exists(part_file):
        return None
    probe = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", part_file],
        capture_output=True, text=True)
    return float(probe.stdout.strip()) if probe.stdout.strip() else 0


def retry(max_attempts=3):
    """Decorator that retries a function with exponential backoff."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    print(f"  ✗ Attempt {attempt}/{max_attempts} failed: {e}")
                    time.sleep(attempt * 2)
        return wrapper
    return decorator
