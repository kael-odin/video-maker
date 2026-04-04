"""SRT subtitle and timing.json generation."""
import os
import re
import json


def format_time(seconds):
    """Format seconds to SRT timestamp: HH:MM:SS,mmm"""
    h, m = int(seconds // 3600), int((seconds % 3600) // 60)
    s, ms = int(seconds % 60), int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_srt(word_boundaries, output_path):
    """Generate SRT subtitle file from word boundaries."""
    srt_lines = []
    subtitle_idx = 1
    current_text = ""
    start_time = end_time = 0

    for i, wb in enumerate(word_boundaries):
        if not current_text:
            start_time = wb["offset"]
        current_text += wb["text"]
        end_time = wb["offset"] + wb["duration"]

        is_strong = wb["text"] in ["。", "！", "？"]
        is_weak = wb["text"] in ["；", ",", "，"]
        is_last = i == len(word_boundaries) - 1
        text_len = len(current_text)

        should_break = is_last or (is_strong and text_len > 15) or (is_weak and text_len > 25) or text_len > 35

        if should_break:
            clean_subtitle = re.sub(r"""^[，。！？、：；""''…—\s]+|[，。！？、：；""''…—\s]+$""", '', current_text.strip())
            if clean_subtitle:
                srt_lines.append(f"{subtitle_idx}\n{format_time(start_time)} --> {format_time(end_time)}\n{clean_subtitle}\n\n")
                subtitle_idx += 1
            current_text = ""

    with open(output_path, "w", encoding="utf-8") as f:
        f.writelines(srt_lines)
    print(f"Subtitles: {output_path} ({len(srt_lines)} entries)")


def write_timing(sections, total_duration, speech_rate, output_path):
    """Generate timing.json for Remotion sync."""
    timing_data = {
        'total_duration': total_duration,
        'fps': 30,
        'total_frames': int(total_duration * 30),
        'speech_rate': speech_rate,
        'sections': [
            {
                'name': s['name'],
                'label': s.get('label', s['name']),
                'start_time': round(s['start_time'], 3),
                'end_time': round(s['end_time'], 3),
                'duration': round(s['duration'], 3),
                'start_frame': int(s['start_time'] * 30),
                'duration_frames': int(s['duration'] * 30),
                'is_silent': s.get('is_silent', False)
            }
            for s in sections
        ]
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(timing_data, f, indent=2, ensure_ascii=False)

    print(f"\nTiming: {output_path}")
    print("\nSection times:")
    for s in timing_data['sections']:
        print(f"  {s['name']}: {s['start_time']:.1f}s - {s['end_time']:.1f}s ({s['duration']:.1f}s)")
    print(f"\nTotal duration: {total_duration:.1f}s ({timing_data['total_frames']} frames @ 30fps)")
