import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '32px', textAlign: 'center', color: '#a9bacb' }}>
          <p>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #465869', background: '#2b3b4a', color: '#eef4fa', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
