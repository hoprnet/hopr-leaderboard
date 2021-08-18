export const VerifyNode = () => {
  return (
    <div display="flex" style={{ margin: "20px 0" }}>
      <p>
        <b>Verify</b>
      </p>
      <small>
        Copy your Ethereum address and go to the admin interface of your HOPR
        node. Using the command “sign”, sign your copied address and paste the
        result here.
      </small>
      <br />
      <small>e.g. “sign 0x2402da10A6172ED018AEEa22CA60EDe1F766655C”</small>
      <br />
      <br />
      <small>
        Copy and paste the contents of the sign function in the following text
        field and click on “Verify your HOPR node”. If valid, your node will
        then be shown as verified in our network with your Ethereum address.
      </small>
      <div display="block" style={{ marginTop: "5px" }}>
        <textarea
          placeholder="0x304402203208f46d1d25c4939760..."
          rows="3"
          display="block"
          style={{ width: "98%", padding: "5px" }}
        />
      </div>
      <button>Verify your HOPR node</button>
    </div>
  );
};
