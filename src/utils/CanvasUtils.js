// Utility functions for canvas operations
export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function resizeCanvasToDisplaySize(canvas) {
  const { width, height } = canvas.getBoundingClientRect();
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}
