import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 text-white p-8">
          <h1 className="text-2xl font-bold mb-4">❌ Error Crítico de React</h1>
          <div className="bg-red-800 p-4 rounded mb-4">
            <p className="font-semibold mb-2">Error:</p>
            <p className="font-mono text-sm">{this.state.error?.message}</p>
          </div>
          
          <details className="bg-red-800 p-4 rounded mb-4">
            <summary className="cursor-pointer font-semibold">Stack Trace</summary>
            <pre className="text-xs mt-2 overflow-auto">
              {this.state.error?.stack}
            </pre>
          </details>
          
          <details className="bg-red-800 p-4 rounded mb-4">
            <summary className="cursor-pointer font-semibold">Component Stack</summary>
            <pre className="text-xs mt-2 overflow-auto">
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
