export function truncate(width: string) {
  return `
    width: ${width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
}

export function shadow(elevation: number) {
  return `
    shadow-offset: 0px 0px;
    shadow-color: black;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
  `;
}
