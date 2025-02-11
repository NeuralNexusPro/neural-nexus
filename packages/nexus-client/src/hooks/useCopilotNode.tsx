import { useCreation } from "ahooks";
import { channel } from "@ennew/one-portal-channel";
import { message } from "antd";
import { get as getGlobalVars } from "@/utils/global";

const useCopilotNode = (config?: Record<string, any>) => {
  const node = useCreation(() => {
    if (!config?.copilot) return null;
    const handleClick = () => {
      const global = getGlobalVars();
      if (global.client === "neural") {
        channel.broadcast("openPageInApplication", config);
      } else {
        message.warning("此功能当前仅支持在工作台中使用");
      }
    };
    const style = {
      width: "fit-content",
      height: "32px",
      display: "flex",
      alignItems: "center",
      borderRadius: "4px",
      padding: "4px 8px",
      backgroundColor: "#f7f8fb",
      cursor: "pointer",
    };
    return (
      <div className="copilot" style={{ height: "fit-content" }}>
        <div onClick={handleClick} style={style}>
          <img
            alt="app"
            src="https://res.ennew.com/image/png/285d6b8ff3f7feb20393efcaaeeaec67.png?optimize=true"
            style={{ width: "16px", height: "20px", marginRight: "8px" }}
          />
          <div style={{ lineHeight: "22px" }}>在应用中打开</div>
        </div>
      </div>
    );
  }, [config]);

  return node;
};

export default useCopilotNode;
