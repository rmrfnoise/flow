import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('flow render error', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-dvh place-items-center bg-[var(--bg)] px-6">
          <div className="w-full max-w-[360px] rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-card)]">
            <h1 className="text-[18px] font-semibold text-[var(--text)]">
              Something went wrong
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-2)]">
              出了点问题。重新加载通常可以恢复，本地数据不会被清除。
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-10 rounded-[10px] bg-[var(--accent)] px-5 text-[13px] font-semibold text-[var(--on-accent)]"
            >
              Reload / 重新加载
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
