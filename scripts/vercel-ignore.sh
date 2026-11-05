#!/bin/sh
# Vercel の Ignored Build Step。vercel.json の ignoreCommand から呼ぶ。
# 終了コード 0 はビルドを飛ばす、1 はビルドする。

# Renovate のブランチはプレビューを作らない。確かめは CI が受け持つ。
case "$VERCEL_GIT_COMMIT_REF" in renovate/*) exit 0 ;; esac
exit 1
