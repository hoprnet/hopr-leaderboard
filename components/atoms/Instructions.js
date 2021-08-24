const Code = ({ code, copyCodeToClipboard, multiline }) => (
  <div className="quick-code">
    <div
      className={`hash ${multiline && "multiline"}`}
      onClick={() => copyCodeToClipboard(code)}
    >
      {multiline ? (
        code.map((loc, index) => <p key={index}>{loc}</p>)
      ) : (
        <p>{code}</p>
      )}
      <div
        style={
          multiline && { position: "absolute", right: 0, padding: "0.7em" }
        }
      >
        <img
          style={{ marginLeft: 8 }}
          src="/assets/icons/copy.svg"
          alt="copy"
        />
      </div>
    </div>
  </div>
);

export const InstructionsNPM = ({ copyCodeToClipboard }) => (
  <ol>
    <li>
      First you need to install NVM. To do so, follow these{" "}
      <a
        href="https://github.com/nvm-sh/nvm#installing-and-updating"
        target="_blank"
        rel="noreferrer"
      >
        <span> steps</span>
      </a>
      . After installing NVM, please check it’s correctly installed by running
      <br />
      <Code code="nvm ls" copyCodeToClipboard={copyCodeToClipboard} />
    </li>
    <li>
      Install version <b>16</b>, which is currently needed for running hoprd.
      <br />
      <Code code="nvm use 16" copyCodeToClipboard={copyCodeToClipboard} />
    </li>
    <li>
      Install wildhorn in your computer globally.
      <br />
      <Code
        code="npm install -g @hoprnet/hoprd@wildhorn"
        copyCodeToClipboard={copyCodeToClipboard}
      />
    </li>
    <li>
      You are ready to run hoprd.
      <br />
      <Code
        code={["hoprd --init --admin --rest \\", "--password='hopr-wildhorn' --testNoAuthentication"]}
        multiline
        copyCodeToClipboard={copyCodeToClipboard}
      />
    </li>
  </ol>
);

export const InstructionsDocker = ({ copyCodeToClipboard }) => (
  <ol>
    <li>
      To install a node using Docker, you first need to install Docker if you
      don’t have it already. To install Docker, follow these{" "}
      <a
        href="http://docs.hoprnet.org/en/latest/src/install-hoprd/using-docker.html"
        target="_blank"
        rel="noreferrer"
      >
        <span> steps</span>
      </a>
      .
    </li>
    <li>
      Ensure you have docker successfully up and running by running
      <br />
      <Code code="docker ps" copyCodeToClipboard={copyCodeToClipboard} />
    </li>
    <li>
      Proceed to install the Wildhorn docker image from Docker Hub
      <br />
      <Code
        code="docker pull hopr/hoprd:matic"
        copyCodeToClipboard={copyCodeToClipboard}
      />
    </li>
    <li>
      Run the docker image with the following default values.
      <br />
      <Code
        multiline
        code={[
          "docker run -v $HOME/.hoprd-db:/app/db \\",
          " -e DEBUG=hopr* \\",
          " -p 9091:9091 -p 3000:3000 -p 8080:8080 \\",
          " hopr/hoprd:matic",
          " --password='h0pR-w1Lh0RN' \\",
          " --init --announce \\",
          " --identity /app/db/.hopr-identity \\",
          " --testNoAuthentication \\",
          " --admin --adminHost 0.0.0.0 \\",
          " --healthCheck --healthCheckHost 0.0.0.0"
        ]}
        copyCodeToClipboard={copyCodeToClipboard}
      />
    </li>
    <li>
      For better authentication, you can replace <code>--testNoAuthentication</code> for
      <br />
      <Code code="--apiToken='h0pR-4p1+0k3N!'" copyCodeToClipboard={copyCodeToClipboard} />
    </li>
  </ol>
);

export const Instructions = ({ setShowMsg, instructionsTarget }) => {
  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  };
  const copyCodeToClipboard = (text) => {
    navigator.clipboard.writeText(text instanceof Array ? text.join("") : text);
    showCopyCode();
  };
  switch (instructionsTarget) {
    case "npm":
      return <InstructionsNPM copyCodeToClipboard={copyCodeToClipboard} />;
    case "docker":
      return <InstructionsDocker copyCodeToClipboard={copyCodeToClipboard} />;
    default:
      return <InstructionsNPM copyCodeToClipboard={copyCodeToClipboard} />;
  }
};
