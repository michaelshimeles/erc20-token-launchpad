"use server";
export const createToken = async (chain: string, wallet: string, data: any) => {
  const {
    name,
    symbol,
    description,
    primary_sales_recipient,
    platform_fees_recipient,
    platform_fees_percentage,
  } = data;

  console.log("data", data);

  console.log("Entered", chain);

  try {
    const response = await fetch(
      "http://localhost:3005/deploy/goerli/prebuilts/token-drop",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-backend-wallet-address":
            "0x2dda24db9270fab5bf075fbb33388462f5fcd6ad",
          "Content-Type": "application/json",
          Authorization: `Bearer 4o5CAz5dzkeL6gyMX1ixLRV3VnyH04QJ07Y7fpl9duz5ofSpqyWS25zMAaDQU-W-J9ryGSgkIkFuKHDbCwD_vg`,
        },
        body: JSON.stringify({
          contractMetadata: {
            name,
            symbol,
            description,
            primary_sale_recipient: primary_sales_recipient,
          },
        }),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.log("action error", error);
    return error;
  }
};
