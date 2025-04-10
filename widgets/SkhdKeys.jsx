import { css } from "uebersicht";

export const command = "cat $HOME/.skhd_mode && cat $HOME/.config/skhd/skhdrc";

export const className = `
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255,255,255,0.9);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  border-radius: 10px;
  white-space: nowrap;
`;

const keyBindingsCSS = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 0 20px;
  height: 24px;

  /* This applies styling specific to Macbook screen with notch */
  @media (width: 1728px) {
      height: 32px;
  }
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

const Spacer = () => (
  <div
    className={css`
      flex-grow: 1;
    `}
  ></div>
);

export const render = ({ output, error }) => {
  const lines = output.split("\n");
  const [mode, modeColor] = lines[0].split(',');
  const backgroundCSS = css`
      background-color: #${modeColor};
  `;
  const allHotKeys = extractHotKeys(lines.slice(1));
  const hotKeys = allHotKeys.filter(({ modes }) => modes.includes(mode));

  return (
    <div
      className={`${backgroundCSS} ${css(keyBindingsCSS)}`}
    >
      <div
        className={`
          ${backgroundCSS} ${css(modeCSS)}
        `}
      >
        {mode}
      </div>

      {hotKeys.map(({ hotKey, comment }, idx) => (
        <div key={idx}>
          <span className={hotKeyStyle}>{hotKey}</span> {comment}
        </div>
      ))}

      <Spacer />

      <div>
        {new Date().toLocaleTimeString("en-us", {
          hour12: true,
          hour: "numeric",
          minute: "2-digit"
        })}
      </div>
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

export const refreshFrequency = 60 * 1000;
