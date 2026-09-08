(() => {
  const originalComputeDelay = window.computeDelay;
  if (typeof originalComputeDelay !== "function") return;

  let nextReplyAt = 0;

  window.computeDelay = function computeOrderedDelay(text) {
    const now = Date.now();
    const baseDelay = originalComputeDelay(text);
    const replyAt = Math.max(now + baseDelay, nextReplyAt + 1);
    nextReplyAt = replyAt;
    return Math.max(0, replyAt - now);
  };
})();
