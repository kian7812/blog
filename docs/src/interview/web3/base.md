# Web3

## 对web3-dapp有基础的了解和开发

通常，DAPP 有三个部分：
* 智能合约（部署-区块链）
* Web应用-用户端，通过智能合约获取和设置数据
* 钱包（MetaMask），作为资产管理工具和用户的签名者，以及区块链的连接器。

**钱包，如Metamask**

它内置了与区块链节点的连接（RPC URL），可以从区块链上读取数据，调用函数，或进行交易，进行签名等操作，把交易等请求发送到区块链节点，等待旷工验证执行。

当metamask插件安装到浏览器，它会将一个ethereum对象注入你的浏览器的全局window对象中，webapp通过window.ethereum来完成与区块链合约交互。

**比如 mint nft 一个webapp应用**

先将webapp连接到metamask钱包，通过metamask注入到window的ethereum 发送eth_requestAccounts（请求获取用户的钱包地址），用户同意则与网站建立连接，并获取到钱包地址。

还可以通过ethereum这个provider获取当前连接区块网络的id和name，和当前账户的余额等。

然后，通过ethereum作为provider，获取用户签名，再加上nft合约的地址和abi生成一个合约实例，通过调用合约上mint函数执行铸造操作，metamask来负责将交易请求发送到网络节点，来等待旷工验证执行完成，这样就简单完成了一个webapp执行一个mint-nft


通过这些任务，我们还了解到 3 种与智能合约交互的方式：
* 读取：从智能合约中获取数据
* 写：在智能合约中更新数据
* 监听，监听智能合约发出的事件