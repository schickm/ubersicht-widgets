import { css } from "uebersicht";

export const command = "cat $HOME/.skhd_mode && cat $HOME/.config/skhd/skhdrc";

export const className = `
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255,255,255,0.9);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  border-radius: 10px;
  white-space: no-wrap;
`;

const stylesByMode = {
  default: css`
    background-color: #61afef;
  `,
  focus: css`
    background-color: #32f032;
  `,
  swap: css`
    background-color: #c678dd;
  `,
  resize: css`
    background-color: #98c379;
  `
};
const keyBindingsCSS = css`
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  padding: 0 10px;
`;

const hotKeyStyle = css`
  font-weight: bold;
  color: #222;
  padding-right: 1px;
`;

const modeCSS = css`
  text-transform: capitalize;
  padding: 0 5px;
  margin: 0 5px 0 15px;
  text-align: center;
  width: 60px;
`;

export const render = ({ output, error }) => {
  const lines = output.split("\n");
  const mode = lines[0];
  console.log("mode", mode);
  const allHotKeys = extractHotKeys(lines.slice(1));
  console.log(allHotKeys);
  const hotKeys = allHotKeys.filter(({ modes }) => modes.includes(mode));
  const keys = [
    { key: "ctrl - space", doc: "focus" },
    { key: "w", doc: "enter warp mode" }
  ];
  return (
    <div
      className={css`
        ${keyBindingsCSS} ${stylesByMode[mode]}
      `}
    >
      <div
        className={css`
          ${modeCSS} ${stylesByMode[mode]}
        `}
      >
        {mode}
      </div>

      {hotKeys.map(({ hotKey, comment }, idx) => (
        <div key={idx}>
          <span className={hotKeyStyle}>{hotKey}</span> {comment}
        </div>
      ))}
    </div>
  );
};

function extractHotKeys(lines) {
  const hotKeys = [];
  for (const line of lines) {
    const match = matchHotKey(line);
    if (match) {
      hotKeys.push({
        modes: match[1].split(",").map(s => s.trim()),
        hotKey: match[2].trim(),
        comment: line
          .split("")
          .reverse()
          .join("")
          .split("#", 1)[0]
          .split("")
          .reverse()
          .join("")
      });
    }
  }
  return hotKeys;
}

function matchHotKey(line) {
  return line.match(/^([a-zA-Z,\s]+)<\s?([^:;]+)/);
}

export const refreshFrequency = false;
