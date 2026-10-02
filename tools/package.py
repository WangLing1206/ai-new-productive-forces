# -*- coding: utf-8 -*-
"""
打包交付物：
  1) deliverables/智启新质-网站源码.zip   —— 仅网站源码（不含依赖、构建产物与视频工程）
  2) deliverables/ 下的视频与字幕、讲解词
用法: python tools/package.py
"""
import os
import shutil
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.path.join(ROOT, 'deliverables')
VID = os.path.join(ROOT, 'video', 'out')
os.makedirs(DL, exist_ok=True)

# ---------------------------------------------------------------- 1. 源码 ZIP
ZIP_NAME = os.path.join(DL, '智启新质-网站源码.zip')
PREFIX = 'ai-new-productive-forces'

INCLUDE_FILES = ['index.html', 'deck.html', 'dashboard.html', 'sources.html',
                 'README.md', 'LICENSE', '.nojekyll', '.gitignore', 'package.json']
INCLUDE_DIRS = ['assets']
EXCLUDE_DIRS = {'node_modules', 'build', 'video', 'deliverables', '.git', 'docs'}
EXCLUDE_EXT = {'.zip', '.mp4', '.webm', '.srt', '.ass'}

count = 0
with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in INCLUDE_FILES:
        p = os.path.join(ROOT, f)
        if os.path.isfile(p):
            z.write(p, PREFIX + '/' + f)
            count += 1
    for d in INCLUDE_DIRS:
        base = os.path.join(ROOT, d)
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [x for x in dirnames if x not in EXCLUDE_DIRS]
            for fn in filenames:
                if os.path.splitext(fn)[1].lower() in EXCLUDE_EXT:
                    continue
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, ROOT).replace('\\', '/')
                z.write(full, PREFIX + '/' + rel)
                count += 1
    # tools 为开发/验收脚本，属源码的一部分
    for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, 'tools')):
        dirnames[:] = [x for x in dirnames if x not in EXCLUDE_DIRS]
        for fn in filenames:
            if fn in ('dbg.js',):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace('\\', '/')
            z.write(full, PREFIX + '/' + rel)
            count += 1

print('源码 ZIP：%s（%d 个文件，%.2f MB）' % (
    os.path.basename(ZIP_NAME), count, os.path.getsize(ZIP_NAME) / 1024 / 1024))

# ---------------------------------------------------------------- 2. 视频与字幕
COPIES = [
    (os.path.join(VID, '智启新质-演示视频.mp4'), '智启新质-演示视频.mp4'),
    (os.path.join(VID, 'subtitles.srt'), '智启新质-演示视频-字幕.srt'),
    (os.path.join(VID, '讲解词与时间码.md'), '智启新质-演示视频-讲解词与时间码.md'),
]
for src, name in COPIES:
    if os.path.isfile(src):
        shutil.copy2(src, os.path.join(DL, name))
        print('已复制：%s（%.2f MB）' % (name, os.path.getsize(src) / 1024 / 1024))
    else:
        print('缺失：' + src)
