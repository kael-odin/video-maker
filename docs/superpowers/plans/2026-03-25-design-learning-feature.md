# Design Learning Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `learn` capability that extracts design attributes from reference videos/images via Claude Vision, stores them in a reference library, and creates reusable style profiles.

**Architecture:** Python script (`learn_design.py`) handles image extraction (ffmpeg for video, file copy for images). Claude Vision performs all design analysis in conversation context. Results stored as `report.json` in `design_references/{id}/` directories, indexed in `user_prefs.json` with optional named style profiles. Playwright URL extraction is Phase 4 (experimental).

**Tech Stack:** Python 3 (ffmpeg subprocess calls), JSON schema (draft-07), Playwright MCP (Phase 4), Claude Vision (conversation-level image analysis)

**Spec:** `docs/superpowers/specs/2026-03-25-design-learning-feature.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `learn_design.py` | **New.** CLI for image extraction: validates inputs, runs ffmpeg for video frame extraction, copies image files, creates `design_references/{id}/` directory structure. ~150 lines. |
| `user_prefs.json` | **Modify.** Add `style_profiles: {}` and `design_references: {}` fields, bump version to `"1.1"`. |
| `user_prefs.template.json` | **Modify.** Same new fields as defaults for fresh installs. |
| `prefs_schema.json` | **Modify.** Add JSON Schema definitions for `style_profiles` and `design_references`. |
| `.gitignore` | **Modify.** Add `design_references/*/frames/` and `design_references/*/cover.*`. |
| `design_references/.gitkeep` | **New.** Empty file to ensure directory exists in git. |
| `tests/test_learn_design.py` | **New.** Unit tests for `learn_design.py` extraction logic. |
| `SKILL.md` | **Modify.** Add learn/references/profiles subcommands, update frontmatter description. |
| `references/workflow-steps.md` | **Modify.** Add pre-workflow design reference section + Step 9 enhancements. |
| `references/troubleshooting.md` | **Modify.** Add learn-related troubleshooting entries. |
| `CLAUDE.md` | **Modify.** Add learn commands to Key Commands, update Architecture section. |

---

## Task 1: Scaffold storage and gitignore

**Files:**
- Create: `design_references/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create design_references directory with .gitkeep**

```bash
mkdir -p design_references && touch design_references/.gitkeep
```

- [ ] **Step 2: Add gitignore rules for binary assets**

Add to `.gitignore` after the `user_prefs.json` line:

```gitignore
# Design reference binary assets (frames, covers)
design_references/*/frames/
design_references/*/cover.*
```

- [ ] **Step 3: Verify gitignore works**

```bash
mkdir -p design_references/test-ref/frames
touch design_references/test-ref/cover.png design_references/test-ref/frames/frame_001.png design_references/test-ref/report.json
git status
# Expected: report.json is trackable, cover.png and frames/ are ignored
rm -rf design_references/test-ref
```

- [ ] **Step 4: Commit**

```bash
git add design_references/.gitkeep .gitignore
git commit -m "chore: scaffold design_references directory and gitignore binary assets"
```

---

## Task 2: Evolve user_prefs schema (v1.0 → v1.1)

**Files:**
- Modify: `prefs_schema.json`
- Modify: `user_prefs.template.json`
- Modify: `user_prefs.json`

- [ ] **Step 1: Add style_profiles schema to prefs_schema.json**

Add after the `topic_patterns` property (after line 202 in `prefs_schema.json`):

```json
"style_profiles": {
  "type": "object",
  "description": "User-defined style profiles, each linking design preferences to reference videos",
  "additionalProperties": {
    "type": "object",
    "required": ["description", "props_override", "references", "created_at", "updated_at"],
    "properties": {
      "description": {
        "type": "string",
        "description": "Human-readable description of this style"
      },
      "props_override": {
        "type": "object",
        "description": "Remotion videoSchema prop overrides (primaryColor, backgroundColor, etc.)",
        "additionalProperties": true
      },
      "preferred_layouts": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Preferred section layout component names (CenteredShowcase, SplitLayout, etc.)"
      },
      "preferred_backgrounds": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["gradient", "shapes", "grid", "clean"]
        }
      },
      "animation_feel": {
        "type": "string",
        "enum": ["gentle", "snappy", "bouncy"]
      },
      "density": {
        "type": "string",
        "enum": ["spacious", "balanced", "dense"]
      },
      "references": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Reference IDs linked to this profile"
      },
      "created_at": {
        "type": "string",
        "format": "date"
      },
      "updated_at": {
        "type": "string",
        "format": "date"
      }
    }
  }
},
"design_references": {
  "type": "object",
  "description": "Index of analyzed design references (data stored in design_references/ directory)",
  "additionalProperties": {
    "type": "object",
    "required": ["path", "analyzed_at"],
    "properties": {
      "path": {
        "type": "string",
        "description": "Relative path to reference directory"
      },
      "title": {
        "type": "string",
        "description": "Title of the reference video"
      },
      "source_url": {
        "type": "string",
        "description": "Original URL if applicable"
      },
      "analyzed_at": {
        "type": "string",
        "format": "date"
      },
      "tags": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```

- [ ] **Step 2: Update user_prefs.template.json**

Add before `"learning_history"`:

```json
"style_profiles": {},
"design_references": {},
```

Bump `"version"` to `"1.1"`.

- [ ] **Step 3: Update user_prefs.json (local only)**

Same changes as template: add empty `style_profiles` and `design_references`, bump version to `"1.1"`.

Note: `user_prefs.json` is gitignored — this step is for local development only and won't be committed.

- [ ] **Step 4: Validate schema consistency**

```bash
python3 -c "
import json
schema = json.load(open('prefs_schema.json'))
template = json.load(open('user_prefs.template.json'))
# Check all template keys exist in schema properties
for key in template:
    assert key in schema['properties'], f'Missing schema for {key}'
print('Schema and template are consistent')
"
```

Expected: `Schema and template are consistent`

- [ ] **Step 5: Commit**

```bash
git add prefs_schema.json user_prefs.template.json
git commit -m "feat: add style_profiles and design_references to preference schema (v1.1)"
```

Note: `user_prefs.json` is gitignored, so only template and schema are committed.

---

## Task 3: Write learn_design.py — image extraction

**Files:**
- Create: `learn_design.py`
- Create: `tests/test_learn_design.py`

- [ ] **Step 1: Write failing tests for core extraction functions**

First, add `learn_design` module loading to `tests/conftest.py`:

```python
# learn_design.py
learn_module = _load_module(
    "learn_design",
    os.path.join(_project_root, "learn_design.py"),
    fake_argv=["learn_design.py", "--help"],
)
```

Then create `tests/test_learn_design.py`:

```python
"""Tests for learn_design.py image extraction and preference management."""
import json
import os
from conftest import learn_module as learn


class TestGenerateReferenceId:
    def test_url_bilibili(self):
        assert learn.generate_reference_id("https://bilibili.com/video/BV1xx411c7xx") == "bilibili-BV1xx411c7xx"

    def test_url_youtube(self):
        assert learn.generate_reference_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == "youtube-dQw4w9WgXcQ"

    def test_url_youtube_short(self):
        assert learn.generate_reference_id("https://youtu.be/dQw4w9WgXcQ") == "youtube-dQw4w9WgXcQ"

    def test_url_fallback_deterministic(self):
        """Same URL always produces the same reference ID."""
        id1 = learn.generate_reference_id("https://example.com/some/video")
        id2 = learn.generate_reference_id("https://example.com/some/video")
        assert id1 == id2

    def test_local_video(self):
        assert learn.generate_reference_id("/path/to/my-reference.mp4") == "local-my-reference"

    def test_images_with_name(self):
        assert learn.generate_reference_id("images", name="dark-tech") == "images-dark-tech"

    def test_images_without_name(self):
        ref_id = learn.generate_reference_id("images")
        assert ref_id.startswith("images-")

    def test_collision_suffix(self):
        existing = {"bilibili-BV1xx411c7xx"}
        ref_id = learn.generate_reference_id(
            "https://bilibili.com/video/BV1xx411c7xx",
            existing_ids=existing,
        )
        assert ref_id == "bilibili-BV1xx411c7xx-2"


class TestDetectInputType:
    def test_url_detection(self):
        assert learn.detect_input_type("https://bilibili.com/video/BVxxx") == "url"
        assert learn.detect_input_type("http://youtube.com/watch?v=abc") == "url"

    def test_video_detection(self, tmp_path):
        video = tmp_path / "test.mp4"
        video.write_bytes(b"\x00" * 100)
        assert learn.detect_input_type(str(video)) == "local_video"

    def test_image_detection(self, tmp_path):
        img = tmp_path / "test.png"
        img.write_bytes(b"\x00" * 100)
        assert learn.detect_input_type(str(img)) == "image"

    def test_unsupported(self, tmp_path):
        txt = tmp_path / "test.txt"
        txt.write_text("hello")
        assert learn.detect_input_type(str(txt)) == "unsupported"

    def test_nonexistent_file(self):
        assert learn.detect_input_type("/nonexistent/path.png") == "not_found"


class TestDetectOrientation:
    def test_horizontal(self):
        assert learn.detect_orientation(1920, 1080) == "horizontal"

    def test_vertical(self):
        assert learn.detect_orientation(1080, 1920) == "vertical"

    def test_square_defaults_horizontal(self):
        assert learn.detect_orientation(1080, 1080) == "horizontal"


class TestCreateReferenceDir:
    def test_creates_structure(self, tmp_path):
        ref_dir = learn.create_reference_dir(str(tmp_path), "test-ref")
        assert os.path.isdir(ref_dir)
        assert os.path.isdir(os.path.join(ref_dir, "frames"))

    def test_returns_path(self, tmp_path):
        ref_dir = learn.create_reference_dir(str(tmp_path), "test-ref")
        assert ref_dir == os.path.join(str(tmp_path), "test-ref")


class TestCopyImages:
    def test_copies_images(self, tmp_path):
        src = tmp_path / "src"
        src.mkdir()
        for i in range(3):
            (src / f"img_{i}.png").write_bytes(b"\x89PNG" + b"\x00" * 100)

        ref_dir = tmp_path / "ref"
        ref_dir.mkdir()
        (ref_dir / "frames").mkdir()

        images = [str(src / f"img_{i}.png") for i in range(3)]
        result = learn.copy_images(images, str(ref_dir))

        assert len(result) == 3
        assert os.path.exists(os.path.join(str(ref_dir), "frames", "frame_001.png"))
        assert os.path.exists(os.path.join(str(ref_dir), "cover.png"))

    def test_first_image_becomes_cover(self, tmp_path):
        src = tmp_path / "src"
        src.mkdir()
        (src / "first.png").write_bytes(b"\x89PNG" + b"\x00" * 50)

        ref_dir = tmp_path / "ref"
        ref_dir.mkdir()
        (ref_dir / "frames").mkdir()

        learn.copy_images([str(src / "first.png")], str(ref_dir))
        assert os.path.exists(os.path.join(str(ref_dir), "cover.png"))

    def test_max_frames_cap(self, tmp_path):
        """Passing more than MAX_FRAMES images only copies MAX_FRAMES."""
        src = tmp_path / "src"
        src.mkdir()
        for i in range(12):
            (src / f"img_{i}.png").write_bytes(b"\x89PNG" + b"\x00" * 100)

        ref_dir = tmp_path / "ref"
        ref_dir.mkdir()
        (ref_dir / "frames").mkdir()

        images = [str(src / f"img_{i}.png") for i in range(12)]
        result = learn.copy_images(images, str(ref_dir))
        assert len(result) == 8  # MAX_FRAMES

    def test_cover_preserves_extension(self, tmp_path):
        """Cover file preserves original extension instead of hardcoding .png."""
        src = tmp_path / "src"
        src.mkdir()
        (src / "photo.jpg").write_bytes(b"\xff\xd8\xff" + b"\x00" * 100)

        ref_dir = tmp_path / "ref"
        ref_dir.mkdir()
        (ref_dir / "frames").mkdir()

        learn.copy_images([str(src / "photo.jpg")], str(ref_dir))
        assert os.path.exists(os.path.join(str(ref_dir), "cover.jpg"))


class TestSaveReport:
    def test_writes_valid_json(self, tmp_path):
        report = {
            "report_version": "1.0",
            "source": {"type": "images"},
            "summary": "test",
            "tags": ["test"],
        }
        learn.save_report(report, str(tmp_path))
        saved = json.load(open(tmp_path / "report.json"))
        assert saved["report_version"] == "1.0"
        assert saved["summary"] == "test"


class TestPreferenceManagement:
    def _base_prefs_v10(self):
        """Return a minimal v1.0 user_prefs structure."""
        return {
            "version": "1.0",
            "updated_at": None,
            "global": {"visual": {}, "tts": {}, "content": {}},
            "topic_patterns": {},
            "learning_history": [],
        }

    def test_load_prefs_migrates_v10_to_v11(self, tmp_path):
        prefs_path = tmp_path / "user_prefs.json"
        prefs_path.write_text(json.dumps(self._base_prefs_v10()))

        prefs = learn.load_prefs(str(prefs_path))
        assert prefs["version"] == "1.1"
        assert "style_profiles" in prefs
        assert "design_references" in prefs

    def test_load_prefs_preserves_existing_fields(self, tmp_path):
        prefs_path = tmp_path / "user_prefs.json"
        v10 = self._base_prefs_v10()
        v10["global"]["visual"]["primaryColor"] = "#ff0000"
        prefs_path.write_text(json.dumps(v10))

        prefs = learn.load_prefs(str(prefs_path))
        assert prefs["global"]["visual"]["primaryColor"] == "#ff0000"

    def test_add_reference_index(self):
        prefs = {"design_references": {}}
        prefs = learn.add_reference_index(prefs, "bilibili-BVxxx", "Test Video", "https://bilibili.com/video/BVxxx", ["tech"])
        assert "bilibili-BVxxx" in prefs["design_references"]
        assert prefs["design_references"]["bilibili-BVxxx"]["title"] == "Test Video"
        assert prefs["design_references"]["bilibili-BVxxx"]["tags"] == ["tech"]

    def test_add_style_profile_creates_new(self):
        prefs = {"style_profiles": {}}
        prefs = learn.add_style_profile(
            prefs, "dark-tech", "Dark tech style",
            props_override={"primaryColor": "#4f6ef7"},
            preferred_layouts=["CenteredShowcase"],
            references=["bilibili-BVxxx"],
        )
        profile = prefs["style_profiles"]["dark-tech"]
        assert profile["description"] == "Dark tech style"
        assert profile["props_override"]["primaryColor"] == "#4f6ef7"
        assert "CenteredShowcase" in profile["preferred_layouts"]

    def test_add_style_profile_updates_existing(self):
        prefs = {"style_profiles": {
            "dark-tech": {
                "description": "v1",
                "props_override": {"primaryColor": "#4f6ef7"},
                "preferred_layouts": ["CenteredShowcase"],
                "preferred_backgrounds": [],
                "animation_feel": "gentle",
                "density": "balanced",
                "references": ["ref-1"],
                "created_at": "2026-03-20",
                "updated_at": "2026-03-20",
            }
        }}
        prefs = learn.add_style_profile(
            prefs, "dark-tech", None,
            props_override={"accentColor": "#ff0000"},
            preferred_layouts=["MetricsRow"],
            references=["ref-2"],
        )
        profile = prefs["style_profiles"]["dark-tech"]
        # Union of layouts
        assert "CenteredShowcase" in profile["preferred_layouts"]
        assert "MetricsRow" in profile["preferred_layouts"]
        # Merged props
        assert profile["props_override"]["primaryColor"] == "#4f6ef7"
        assert profile["props_override"]["accentColor"] == "#ff0000"
        # Union of references
        assert "ref-1" in profile["references"]
        assert "ref-2" in profile["references"]

    def test_remove_reference_cleans_profiles(self, tmp_path):
        prefs = {
            "design_references": {"ref-1": {"path": "design_references/ref-1/"}},
            "style_profiles": {
                "my-style": {"references": ["ref-1", "ref-2"]}
            },
        }
        ref_dir = tmp_path / "ref-1"
        ref_dir.mkdir()

        prefs = learn.remove_reference(prefs, "ref-1", str(tmp_path))
        assert "ref-1" not in prefs["design_references"]
        assert "ref-1" not in prefs["style_profiles"]["my-style"]["references"]
        assert "ref-2" in prefs["style_profiles"]["my-style"]["references"]

    def test_cleanup_orphaned_references(self, tmp_path):
        prefs = {
            "design_references": {
                "exists": {"path": "exists/"},
                "gone": {"path": "gone/"},
            }
        }
        (tmp_path / "exists").mkdir()
        # "gone" directory intentionally not created

        prefs = learn.cleanup_orphaned_references(prefs, str(tmp_path))
        assert "exists" in prefs["design_references"]
        assert "gone" not in prefs["design_references"]
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/niehu/myagents/myskills/video-podcast-maker && python3 -m pytest tests/test_learn_design.py -v
```

Expected: All tests FAIL (module not found or functions missing).

- [ ] **Step 3: Write learn_design.py with all extraction functions**

Create `learn_design.py`:

```python
#!/usr/bin/env python3
"""
Design Reference Extractor for Video Podcast Maker
Extracts frames from videos/images for Claude Vision design analysis.
"""
import os
import sys
import json
import argparse
import hashlib
import shutil
import subprocess
import re
import time
from datetime import datetime


# ============ Constants ============

SUPPORTED_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
SUPPORTED_VIDEO_EXTS = {".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"}
MAX_FRAMES = 8
SCENE_THRESHOLD = 0.3
DEDUP_SECONDS = 2.0
MAX_VIDEO_SIZE_BYTES = 2 * 1024 * 1024 * 1024  # 2GB


# ============ Input Detection ============

def detect_input_type(path):
    """Detect whether input is a URL, local video, image, or unsupported."""
    if path.startswith("http://") or path.startswith("https://"):
        return "url"
    if not os.path.exists(path):
        return "not_found"
    ext = os.path.splitext(path)[1].lower()
    if ext in SUPPORTED_VIDEO_EXTS:
        return "local_video"
    if ext in SUPPORTED_IMAGE_EXTS:
        return "image"
    return "unsupported"


def detect_orientation(width, height):
    """Detect video/image orientation from dimensions."""
    if height > width:
        return "vertical"
    return "horizontal"


# ============ Reference ID Generation ============

def generate_reference_id(source, name=None, existing_ids=None):
    """Generate a unique reference ID from the source.

    Rules:
    - URL: {platform}-{video_id}
    - Local video: local-{filename_without_ext}
    - Images: images-{name} or images-{timestamp}
    - Collision: append -2, -3, etc.
    """
    existing_ids = existing_ids or set()

    if source.startswith("http://") or source.startswith("https://"):
        ref_id = _id_from_url(source)
    elif source == "images":
        ref_id = f"images-{name}" if name else f"images-{int(time.time())}"
    else:
        basename = os.path.splitext(os.path.basename(source))[0]
        ref_id = f"local-{basename}"

    # Handle collision
    if ref_id in existing_ids:
        suffix = 2
        while f"{ref_id}-{suffix}" in existing_ids:
            suffix += 1
        ref_id = f"{ref_id}-{suffix}"

    return ref_id


def _id_from_url(url):
    """Extract platform and video ID from URL."""
    # Bilibili
    m = re.search(r'bilibili\.com/video/(BV[\w]+)', url)
    if m:
        return f"bilibili-{m.group(1)}"

    # YouTube (full URL)
    m = re.search(r'youtube\.com/watch\?v=([\w-]+)', url)
    if m:
        return f"youtube-{m.group(1)}"

    # YouTube (short URL)
    m = re.search(r'youtu\.be/([\w-]+)', url)
    if m:
        return f"youtube-{m.group(1)}"

    # Fallback: domain + hash
    from urllib.parse import urlparse
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "").split(".")[0]
    path_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{domain}-{path_hash}"


# ============ Directory Management ============

def create_reference_dir(base_dir, ref_id):
    """Create the reference directory structure."""
    ref_dir = os.path.join(base_dir, ref_id)
    os.makedirs(os.path.join(ref_dir, "frames"), exist_ok=True)
    return ref_dir


# ============ Image Extraction ============

def copy_images(image_paths, ref_dir):
    """Copy image files to reference directory.

    First image also becomes cover.png.
    Returns list of copied frame paths.
    """
    frames_dir = os.path.join(ref_dir, "frames")
    copied = []

    for i, img_path in enumerate(image_paths[:MAX_FRAMES]):
        ext = os.path.splitext(img_path)[1].lower()
        dest = os.path.join(frames_dir, f"frame_{i+1:03d}{ext}")
        shutil.copy2(img_path, dest)
        copied.append(dest)

    # First image becomes cover (preserving original extension)
    if image_paths:
        cover_ext = os.path.splitext(image_paths[0])[1].lower() or ".png"
        cover_dest = os.path.join(ref_dir, f"cover{cover_ext}")
        shutil.copy2(image_paths[0], cover_dest)

    return copied


def get_video_duration(video_path):
    """Get video duration in seconds using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", video_path],
            capture_output=True, text=True, timeout=30,
        )
        return float(result.stdout.strip())
    except (subprocess.TimeoutExpired, ValueError, FileNotFoundError):
        return None


def get_video_dimensions(video_path):
    """Get video width and height using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height",
             "-of", "csv=p=0:s=x", video_path],
            capture_output=True, text=True, timeout=30,
        )
        w, h = result.stdout.strip().split("x")
        return int(w), int(h)
    except (subprocess.TimeoutExpired, ValueError, FileNotFoundError):
        return None, None


def extract_video_frames(video_path, ref_dir):
    """Extract frames from a local video file.

    Returns list of extracted frame paths.
    """
    frames_dir = os.path.join(ref_dir, "frames")

    # Check file size
    file_size = os.path.getsize(video_path)
    if file_size > MAX_VIDEO_SIZE_BYTES:
        print(f"Warning: Video is {file_size / 1e9:.1f}GB (>{MAX_VIDEO_SIZE_BYTES / 1e9:.0f}GB). Extracting from first 30 minutes only.")

    # Get duration for evenly-spaced extraction
    duration = get_video_duration(video_path)
    if duration is None:
        print("Warning: Could not determine video duration. Using fixed interval.", file=sys.stderr)
        duration = 300  # fallback 5 min

    # Calculate interval
    interval = max(duration / MAX_FRAMES, 1)

    # Extract evenly-spaced frames
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vf", f"fps=1/{interval:.2f},scale=-1:1080",
        "-frames:v", str(MAX_FRAMES),
        "-vsync", "vfn",
        "-q:v", "2",
        os.path.join(frames_dir, "frame_%03d.png"),
    ]

    try:
        subprocess.run(cmd, capture_output=True, text=True, timeout=300, check=True)
    except FileNotFoundError:
        print("Error: ffmpeg not installed. Please install ffmpeg or provide screenshots instead.", file=sys.stderr)
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error: ffmpeg failed: {e.stderr}", file=sys.stderr)
        return []

    # Collect extracted frames
    frames = sorted(
        [os.path.join(frames_dir, f) for f in os.listdir(frames_dir) if f.startswith("frame_")]
    )

    # First frame becomes cover
    if frames:
        shutil.copy2(frames[0], os.path.join(ref_dir, "cover.png"))

    return frames


# ============ Report Management ============

def save_report(report, ref_dir):
    """Save analysis report to reference directory."""
    path = os.path.join(ref_dir, "report.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    return path


def load_report(ref_dir):
    """Load analysis report from reference directory."""
    path = os.path.join(ref_dir, "report.json")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ============ Preference Index Management ============

def load_prefs(prefs_path):
    """Load user_prefs.json, migrating v1.0 to v1.1 if needed."""
    if not os.path.exists(prefs_path):
        return None
    with open(prefs_path, "r", encoding="utf-8") as f:
        prefs = json.load(f)

    # Migrate v1.0 → v1.1
    if prefs.get("version") == "1.0":
        prefs["version"] = "1.1"
        if "style_profiles" not in prefs:
            prefs["style_profiles"] = {}
        if "design_references" not in prefs:
            prefs["design_references"] = {}
        save_prefs(prefs, prefs_path)
        print("Migrated user_prefs.json from v1.0 to v1.1")

    return prefs


def save_prefs(prefs, prefs_path):
    """Save user_prefs.json."""
    prefs["updated_at"] = datetime.now().isoformat()
    with open(prefs_path, "w", encoding="utf-8") as f:
        json.dump(prefs, f, indent=2, ensure_ascii=False)


def add_reference_index(prefs, ref_id, title, source_url, tags):
    """Add a reference to the design_references index."""
    if "design_references" not in prefs:
        prefs["design_references"] = {}
    prefs["design_references"][ref_id] = {
        "path": f"design_references/{ref_id}/",
        "title": title or "",
        "source_url": source_url or "",
        "analyzed_at": datetime.now().strftime("%Y-%m-%d"),
        "tags": tags or [],
    }
    return prefs


def add_style_profile(prefs, name, description, props_override, preferred_layouts=None,
                       preferred_backgrounds=None, animation_feel=None, density=None, references=None):
    """Create or update a style profile."""
    if "style_profiles" not in prefs:
        prefs["style_profiles"] = {}

    today = datetime.now().strftime("%Y-%m-%d")
    existing = prefs["style_profiles"].get(name)

    if existing:
        # Update existing profile
        existing["props_override"].update(props_override or {})
        if preferred_layouts:
            existing["preferred_layouts"] = list(set(existing.get("preferred_layouts", []) + preferred_layouts))
        if preferred_backgrounds:
            existing["preferred_backgrounds"] = list(set(existing.get("preferred_backgrounds", []) + preferred_backgrounds))
        if animation_feel:
            existing["animation_feel"] = animation_feel
        if density:
            existing["density"] = density
        if references:
            existing["references"] = list(set(existing.get("references", []) + references))
        existing["updated_at"] = today
    else:
        # Create new profile
        prefs["style_profiles"][name] = {
            "description": description or "",
            "props_override": props_override or {},
            "preferred_layouts": preferred_layouts or [],
            "preferred_backgrounds": preferred_backgrounds or [],
            "animation_feel": animation_feel or "gentle",
            "density": density or "balanced",
            "references": references or [],
            "created_at": today,
            "updated_at": today,
        }

    return prefs


def remove_reference(prefs, ref_id, design_refs_base):
    """Remove a reference and its directory."""
    # Remove from index
    if "design_references" in prefs and ref_id in prefs["design_references"]:
        del prefs["design_references"][ref_id]

    # Remove from any profiles
    for profile in prefs.get("style_profiles", {}).values():
        if ref_id in profile.get("references", []):
            profile["references"].remove(ref_id)

    # Remove directory
    ref_dir = os.path.join(design_refs_base, ref_id)
    if os.path.isdir(ref_dir):
        shutil.rmtree(ref_dir)
        print(f"Removed {ref_dir}")

    return prefs


def cleanup_orphaned_references(prefs, design_refs_base):
    """Remove index entries whose directories no longer exist."""
    if "design_references" not in prefs:
        return prefs
    orphaned = []
    for ref_id, ref_data in prefs["design_references"].items():
        ref_dir = os.path.join(design_refs_base, ref_id)
        if not os.path.isdir(ref_dir):
            orphaned.append(ref_id)
    for ref_id in orphaned:
        del prefs["design_references"][ref_id]
        print(f"Cleaned up orphaned reference: {ref_id}")
    return prefs


# ============ CLI ============

def main():
    parser = argparse.ArgumentParser(description="Extract design reference frames for video-podcast-maker")
    parser.add_argument("inputs", nargs="*", help="Input files, videos, or URLs")
    parser.add_argument("--name", help="Reference name (for image sets)")
    parser.add_argument("--output-dir", default="design_references", help="Base output directory")
    parser.add_argument("--list", action="store_true", help="List all references")
    parser.add_argument("--show", help="Show reference report")
    parser.add_argument("--delete", help="Delete a reference")
    args = parser.parse_args()

    if args.list:
        _cmd_list(args.output_dir)
    elif args.show:
        _cmd_show(args.show, args.output_dir)
    elif args.delete:
        _cmd_delete(args.delete, args.output_dir)
    elif args.inputs:
        _cmd_extract(args.inputs, args.name, args.output_dir)
    else:
        parser.print_help()


def _cmd_list(base_dir):
    """List all design references."""
    if not os.path.isdir(base_dir):
        print("No design references found.")
        return
    total_size = 0
    for entry in sorted(os.listdir(base_dir)):
        ref_dir = os.path.join(base_dir, entry)
        if not os.path.isdir(ref_dir) or entry.startswith("."):
            continue
        report = load_report(ref_dir)
        size = sum(
            os.path.getsize(os.path.join(dp, f))
            for dp, _, fns in os.walk(ref_dir)
            for f in fns
        )
        total_size += size
        summary = report.get("summary", "No analysis yet") if report else "No analysis yet"
        print(f"  {entry} ({size / 1e6:.1f}MB) — {summary}")
    print(f"\nTotal: {total_size / 1e6:.1f}MB")


def _cmd_show(ref_id, base_dir):
    """Show a reference report."""
    ref_dir = os.path.join(base_dir, ref_id)
    report = load_report(ref_dir)
    if report:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(f"No report found for {ref_id}")


def _cmd_delete(ref_id, base_dir):
    """Delete a reference."""
    ref_dir = os.path.join(base_dir, ref_id)
    if os.path.isdir(ref_dir):
        shutil.rmtree(ref_dir)
        print(f"Deleted {ref_id}")
    else:
        print(f"Reference {ref_id} not found")


def _cmd_extract(inputs, name, base_dir):
    """Extract frames from inputs."""
    # Detect input types
    images = []
    videos = []
    urls = []

    for inp in inputs:
        input_type = detect_input_type(inp)
        if input_type == "image":
            images.append(inp)
        elif input_type == "local_video":
            videos.append(inp)
        elif input_type == "url":
            urls.append(inp)
        elif input_type == "not_found":
            print(f"Warning: File not found: {inp}", file=sys.stderr)
        else:
            print(f"Warning: Unsupported file type: {inp}", file=sys.stderr)

    if not images and not videos and not urls:
        print("Error: No valid inputs provided.", file=sys.stderr)
        sys.exit(1)

    # Determine source for reference ID
    if urls:
        source = urls[0]
    elif videos:
        source = videos[0]
    else:
        source = "images"

    ref_id = generate_reference_id(source, name=name)
    ref_dir = create_reference_dir(base_dir, ref_id)
    all_frames = []

    # Process images
    if images:
        all_frames.extend(copy_images(images, ref_dir))

    # Process videos
    for video in videos:
        frames = extract_video_frames(video, ref_dir)
        all_frames.extend(frames)

    # URLs need Playwright — print instruction for Claude
    if urls:
        print(f"\nURL extraction requires Playwright. Use browser tools to:")
        print(f"  1. Navigate to {urls[0]}")
        print(f"  2. Screenshot cover and key frames")
        print(f"  3. Save to {os.path.join(ref_dir, 'frames/')}")

    print(f"\nReference created: {ref_id}")
    print(f"  Directory: {ref_dir}")
    print(f"  Frames: {len(all_frames)}")
    print(f"\nNext: Claude Vision will analyze the frames and generate report.json")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/niehu/myagents/myskills/video-podcast-maker && python3 -m pytest tests/test_learn_design.py -v
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add learn_design.py tests/test_learn_design.py
git commit -m "feat: add learn_design.py for design reference frame extraction"
```

---

## Task 4: Update SKILL.md with learn commands

**Files:**
- Modify: `SKILL.md` (frontmatter description + new section)

- [ ] **Step 1: Update SKILL.md frontmatter description for discoverability**

Change the `description` field to:

```yaml
description: Use when user provides a topic and wants an automated video podcast created, OR when user wants to learn/analyze video design patterns from reference videos — handles research, script writing, TTS audio synthesis, Remotion video creation, and final MP4 output with background music. Also supports design learning from reference videos (learn command), style profile management, and design reference library.
```

- [ ] **Step 2: Add learn/references/profiles command section to SKILL.md**

Add a new section after the Quick Start section (or before the workflow steps) documenting:
- `learn <input>` command syntax and examples
- `references list|show|delete` commands
- `profiles list|show|delete|create` commands
- Pre-workflow design reference usage
- Step 9 style profile integration

Consult the spec's Command Interface section for exact syntax.

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "docs: add learn, references, and profiles commands to SKILL.md"
```

---

## Task 5: Update workflow-steps.md with pre-workflow and Step 9 changes

**Files:**
- Modify: `references/workflow-steps.md`

- [ ] **Step 1: Add pre-workflow Design Reference section**

Add before Step 1 a new section:

```markdown
## Pre-workflow: Design Reference (Optional)

When the user provides a reference video/image with their video creation request:

1. Run extraction: `python3 learn_design.py <input>`
2. Read extracted frames using the Read tool (Claude Vision)
3. Analyze against design-guide.md component vocabulary
4. Present design analysis report to user
5. User confirms/adjusts extracted attributes
6. Apply as session overrides for this video (do NOT save to library unless user asks)
```

- [ ] **Step 2: Update Step 9 with style profile awareness**

Add to the existing Step 9 section the new design decision process:

```markdown
### Style Profile Integration (Step 9)

Before choosing visual design, check in order:
1. Session-specified style profile? → Load `user_prefs.json` style_profiles[name], apply props_override
2. No profile? → Check design_references index for tag matches against detected topic
3. Found matches? → Suggest: "Your reference library has N references matching '{topic}'. Apply style '{profile_name}'?"
4. Nothing matches? → Fall back to global + topic_patterns (existing behavior)

Priority chain: Root.tsx defaults < global < topic_patterns[type] < style_profiles[name] < current instructions
```

- [ ] **Step 3: Commit**

```bash
git add references/workflow-steps.md
git commit -m "docs: add pre-workflow design reference and Step 9 style profile integration"
```

---

## Task 6: Update troubleshooting.md

**Files:**
- Modify: `references/troubleshooting.md`

- [ ] **Step 1: Add learn-related troubleshooting section**

Add a new section:

```markdown
## Design Learning Troubleshooting

### "ffmpeg not found" when learning from video
Install ffmpeg: `brew install ffmpeg` (macOS) or use image input instead.

### Playwright fails on Bilibili/YouTube
URL extraction is experimental. Fallback options:
1. Download the video and use: `learn ./video.mp4`
2. Take screenshots manually and use: `learn ./screenshot1.png ./screenshot2.png`

### Vision analysis colors look wrong
Color values from Claude Vision are approximate. After reviewing the report:
- Adjust colors manually: edit report.json or override when creating the style profile
- Use a color picker tool on the screenshots for precise hex values

### Style profile not applied
Check priority chain: `style_profiles` only override when explicitly specified by name.
Verify: `python3 learn_design.py --list` shows the reference exists.
Verify: `user_prefs.json` → `style_profiles` → your profile name exists with correct props_override.

### Orphaned references (deleted directory but still in index)
Run `references list` — orphaned entries are auto-cleaned on list.
```

- [ ] **Step 2: Commit**

```bash
git add references/troubleshooting.md
git commit -m "docs: add design learning troubleshooting section"
```

---

## Task 7: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add learn commands to Key Commands section**

Add after the existing "Vertical shorts generation" commands:

```markdown
# Design learning
python3 learn_design.py ./screenshot1.png ./screenshot2.png           # Learn from images
python3 learn_design.py ./reference.mp4                                # Learn from local video
python3 learn_design.py --list                                         # List all references
python3 learn_design.py --show <ref-id>                                # Show reference report
python3 learn_design.py --delete <ref-id>                              # Delete a reference
```

- [ ] **Step 2: Update Architecture section**

Add `learn_design.py` to the architecture tree and add a Data Flow entry:

```
learn_design.py                  # Design reference extraction (images, ffmpeg, Playwright)
design_references/               # Stored design analysis reports + frame screenshots
```

Add to Data Flow:

```
reference input → learn_design.py → frames/ + cover.png
                         ↓
               Claude Vision analysis → report.json
                         ↓
               user confirms → style_profiles in user_prefs.json
                         ↓
               Step 9: apply style_profiles → Remotion composition
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add design learning commands and architecture to CLAUDE.md"
```

---

## Task 8: End-to-end manual test

This task verifies the full learn flow works with real image input.

- [ ] **Step 1: Create test reference from images**

```bash
cd /Users/niehu/myagents/myskills/video-podcast-maker

# Create a test image (1px PNG — just to test the pipeline)
python3 -c "
from PIL import Image
img = Image.new('RGB', (1920, 1080), color=(15, 15, 35))
img.save('/tmp/test_cover.png')
img2 = Image.new('RGB', (1920, 1080), color=(79, 110, 247))
img2.save('/tmp/test_frame.png')
" 2>/dev/null || echo "PIL not available, create test images manually"

python3 learn_design.py /tmp/test_cover.png /tmp/test_frame.png --name test-e2e
```

Expected: `Reference created: images-test-e2e` with frames directory populated.

- [ ] **Step 2: Verify list command**

```bash
python3 learn_design.py --list
```

Expected: Shows `images-test-e2e` with size.

- [ ] **Step 3: Verify show command (no report yet)**

```bash
python3 learn_design.py --show images-test-e2e
```

Expected: `No report found for images-test-e2e`

- [ ] **Step 4: Verify delete command**

```bash
python3 learn_design.py --delete images-test-e2e
python3 learn_design.py --list
```

Expected: Reference deleted, no longer in list.

- [ ] **Step 5: Run full test suite**

```bash
python3 -m pytest tests/ -v
```

Expected: All tests pass (existing 52 + new learn_design tests).

- [ ] **Step 6: Commit any fixes**

If any issues found, fix and commit.

```bash
git add learn_design.py tests/test_learn_design.py && git commit -m "test: verify end-to-end design learning pipeline"
```

---

## Summary

| Task | What | Files | Commits |
|------|------|-------|---------|
| 1 | Scaffold storage + gitignore | `.gitignore`, `design_references/.gitkeep` | 1 |
| 2 | Schema evolution v1.1 | `prefs_schema.json`, `user_prefs.template.json` | 1 |
| 3 | learn_design.py + tests | `learn_design.py`, `tests/test_learn_design.py`, `tests/conftest.py` | 1 |
| 4 | SKILL.md commands | `SKILL.md` | 1 |
| 5 | Workflow steps | `references/workflow-steps.md` | 1 |
| 6 | Troubleshooting | `references/troubleshooting.md` | 1 |
| 7 | CLAUDE.md | `CLAUDE.md` | 1 |
| 8 | E2E test | All files | 0-1 |

**Total: 7-8 commits, 5 phases in spec but Tasks 1-8 cover Phases 1-3 (image input + style profiles + ffmpeg video extraction). Phases 4-5 are deferred.**

---

## Deferred to Future Tasks

These items from the spec are intentionally deferred and NOT covered by Tasks 1-8:

| Item | Spec Phase | Reason for deferral |
|------|-----------|---------------------|
| `templates/Thumbnail.tsx` — cover_design overrides from style profiles | Phase 5 | Requires Step 9 runtime integration; thumbnail customization depends on the full learn → apply loop being validated first |
| Playwright URL extraction (Bilibili, YouTube) | Phase 4 | Experimental; most fragile input method; users can use screenshots or local video as fallback |
| Step 9 runtime integration — auto-suggesting style profiles during composition | Phase 5 | Depends on having a populated reference library to test against; build the library tools first |
| Pre-workflow design reference step | Phase 5 | Shortcut for "learn + apply in one session"; requires Step 9 integration |
