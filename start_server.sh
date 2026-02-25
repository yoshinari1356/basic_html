#!/bin/bash

# シンプルHTTPサーバー起動スクリプト
# 使用方法: ./start_server.sh [ポート番号]
# デフォルトポート: 8000

PORT=${1:-8000}

echo "HTTPサーバーを起動しています..."
echo "URL: http://localhost:$PORT"
echo "ディレクトリ: $(pwd)"
echo ""
echo "サーバーを停止するには Ctrl+C を押してください"
echo "========================================="

# Python3でHTTPサーバーを起動
python3 -m http.server $PORT