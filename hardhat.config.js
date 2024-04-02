require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
	compilers: [
		{
		  version: "0.8.0",
		},
		{
		  version: "0.8.6",
		},
		{
			version: "0.8.13",
		},
		{
			version: "0.7.0",
		}, 
	  ]
	},  
	networks: {
		htb: {
			url: "http://94.237.62.195:37366/rpc",
			accounts: [
				`0x01543a50214a3e15266d00e7c2bb131b913fccc98912e16939fd234f2d59eafc`,
			],
		},
	},
};