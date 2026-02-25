# GitHub Actions ワークフロー

このディレクトリには2つのワークフローが含まれています。

---

## ファイル一覧

| ファイル | ワークフロー名 | 役割 |
|----------|--------------|------|
| [`workflows/claude.yml`](#claudeyml) | Claude Code | `@claude` トリガーによるコード変更生成・PR自動作成 |
| [`workflows/pr-preview-pages.yml`](#pr-preview-pagesyml) | PR Preview (GitHub Pages) | PRのプレビュー環境構築・自動デプロイ・クリーンアップ |

---

## `claude.yml`

### 概要

issue・PRコメント・PRレビューに `@claude` が含まれると起動します。
Claude Code が変更を生成し、変更があれば自動でPRを作成します。

### トリガー

| イベント | 条件 |
|----------|------|
| `issue_comment` | コメント本文に `@claude` を含む |
| `pull_request_review_comment` | レビューコメント本文に `@claude` を含む |
| `pull_request_review` | レビュー本文に `@claude` を含む |
| `issues` (opened / assigned) | issue本文またはタイトルに `@claude` を含む |

### ジョブ: `claude`

```
@claude 検知
  └── Checkout repository       リポジトリをクローン（全履歴）
  └── Initialize Claude config  ~/.claude/settings.json などを初期化
  └── Run Claude Code           Claude Code Action を実行し変更を生成
  └── Detect changes            git diff で変更有無を確認（新規ファイルも含む）
      ├── 変更なし → Skip (no changes)      スキップして正常終了
      └── 変更あり → Create Pull Request    ブランチ claude/auto/<run_id> でPR作成
```

#### 主要ステップの詳細

| ステップ | 説明 |
|----------|------|
| **Checkout repository** | `fetch-depth: 0` で全コミット履歴を取得 |
| **Initialize Claude config** | `remote-settings.json` の ENOENT エラーを防ぐため空ファイルを生成 |
| **Run Claude Code** | `anthropics/claude-code-action@v1` を呼び出し、`ANTHROPIC_API_KEY` を使用 |
| **Detect changes** | `git diff`, `git diff --cached`, `git ls-files --others` を組み合わせて判定 |
| **Create Pull Request** | `peter-evans/create-pull-request@v6` でPRを作成。ブランチ名は `claude/auto/<run_id>` |

#### 必要なシークレット

| シークレット | 用途 |
|-------------|------|
| `ANTHROPIC_API_KEY` | Claude Code API 認証 |
| `GITHUB_TOKEN` | PR作成（Actions自動提供） |

---

## `pr-preview-pages.yml`

### 概要

PRが作成・更新・クローズされたとき、または PRコメントでコマンドを送信したときに、
GitHub Pages の `pr-<number>/` フォルダへのプレビューデプロイを管理します。

プレビューURL: `https://<owner>.github.io/<repo>/pr-<number>/`

### トリガー

| イベント | 条件 | 実行ジョブ |
|----------|------|-----------|
| `pull_request` opened / synchronize / reopened | 任意 | `deploy` |
| `pull_request` closed | 任意 | `cleanup` |
| `issue_comment` | PR上のコメントに `/preview deploy` を含む | `deploy` |
| `issue_comment` | PR上のコメントに `/preview cleanup` を含む | `cleanup` |

### ジョブ: `deploy`

PRの内容を GitHub Pages にデプロイします。

```
(pull_request: opened/synchronize/reopened) または (/preview deploy コメント)
  └── Authorize               コメント実行時のみ権限チェック（write/maintain/admin）
  └── Get PR number           イベント種別に応じてPR番号を取得
  └── Get PR head ref         コメント実行時のみ GitHub API でブランチ情報を取得
  └── Checkout PR branch      PRブランチをチェックアウト
  └── Prepare site files      rsync でサイトファイルを .preview_out/ に展開
  └── Deploy to gh-pages      gh-pages の pr-<number>/ にデプロイ
  └── Comment preview URL     PRコメントにプレビューURLを通知
```

#### 主要ステップの詳細

| ステップ | 説明 |
|----------|------|
| **Authorize** | コメントコマンド時のみ実行。権限不足の場合はエラーコメントを投稿して失敗 |
| **Get PR number** | `pull_request` イベントは `github.event.pull_request.number`、コメントは `github.event.issue.number` から取得 |
| **Get PR head ref** | コメントコマンド時は `pull_request` イベントと違いブランチ情報がないため API で取得 |
| **Prepare site files** | `.git/`, `.github/`, `node_modules/`, `.env*`, `*.pem`, `*.key` などを除外してコピー。`404.html` が存在しない場合は `index.html` をコピー（SPA対応） |
| **Deploy to gh-pages** | `JamesIves/github-pages-deploy-action@v4` を使用。`clean: false` でほかのPRのフォルダを削除しない |
| **Comment preview URL** | 自動デプロイかコマンド実行かを区別してコメント内容を変える |

#### concurrency（同時実行制御）

同じPRに対する複数の `deploy` ジョブが同時に走った場合、新しい実行が優先され古い実行はキャンセルされます。

```yaml
concurrency:
  group: pr-preview-deploy-<pr-number>
  cancel-in-progress: true
```

---

### ジョブ: `cleanup`

GitHub Pages から PR のプレビューフォルダを削除します。

```
(pull_request: closed) または (/preview cleanup コメント)
  └── Authorize                    コメント実行時のみ権限チェック
  └── Get PR number                PR番号を取得
  └── Cleanup preview folder       gh-pages ブランチを clone して pr-<number>/ を削除
  └── Comment cleanup result       PRコメントに削除完了を通知
```

#### 主要ステップの詳細

| ステップ | 説明 |
|----------|------|
| **Authorize** | コメントコマンド時のみ実行。権限不足の場合はエラーコメントを投稿して失敗 |
| **Cleanup preview folder** | `GITHUB_TOKEN` を使い gh-pages ブランチを clone → `pr-<number>/` を削除 → コミット・プッシュ。フォルダが存在しない場合はスキップ |
| **Comment cleanup result** | 自動削除かコマンド実行かを区別してコメント内容を変える |

#### concurrency（同時実行制御）

```yaml
concurrency:
  group: pr-preview-cleanup-<pr-number>
  cancel-in-progress: true
```

---

## 責務マトリクス

| イベント | `claude.yml` | `pr-preview-pages.yml` |
|----------|:---:|:---:|
| issue / コメントに `@claude` | ✅ `claude` ジョブ | — |
| PR 作成 (opened) | — | ✅ `deploy` ジョブ |
| PR に push (synchronize) | — | ✅ `deploy` ジョブ |
| PR 再オープン (reopened) | — | ✅ `deploy` ジョブ |
| PR クローズ (closed) | — | ✅ `cleanup` ジョブ |
| PRコメント `/preview deploy` | — | ✅ `deploy` ジョブ |
| PRコメント `/preview cleanup` | — | ✅ `cleanup` ジョブ |

---

## 手動コマンド一覧

PR のコメント欄で以下のコマンドを送信できます（write / maintain / admin 権限が必要）。

| コマンド | 説明 |
|----------|------|
| `/preview deploy` | 最新ブランチの内容で強制的に再デプロイ |
| `/preview cleanup` | プレビューフォルダを手動削除 |
