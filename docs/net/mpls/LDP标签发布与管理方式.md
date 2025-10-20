# LDP标签发布与管理方式

相关标准分别定义了标签发布方式、标签分配控制方式、标签保持方式来决定LSR如何发布和管理标签

当前设备支持如下组合：

- 下游自主方式（DU）＋有序标签控制方式（Ordered）＋自由标签保持方式（Liberal）。
- 下游按需方式（DoD）＋有序标签控制方式（Ordered）＋保守标签保持方式（Conservative）

## 标签发布方式

下游自主方式（Downstream Unsolicited），是指对于一个特定的FEC，LSR无须从上游获得标签请求消息即进行标签分配与分发。

下游按需方式（Downstream on Demand），是指对于一个特定的FEC，LSR获得标签请求消息之后才进行标签分配与分发。

## 标签分配控制方式

标签分配控制方式（Label Distribution Control Mode）是指在LSP的建立过程中，LSR分配标签时采用的处理方式。标签分配控制方式可以分为以下两种：

- 独立标签分配控制（Independent），是指本地LSR可以自主地分配一个标签绑定到某个FEC，并通告给上游LSR，而无需等待下游的标签。
  - 如[图1 DU方式](https://support.huawei.com/enterprise/zh/doc/EDOC1100421950/b809570c#fig144124113415)所示，如果标签发布方式为DU，且标签分配控制方式为Independent，则LSR（Transit）无需等待下游（Egress）的标签，就会直接向上游（Ingress）分发标签。
  - 如[图2 DoD方式](https://support.huawei.com/enterprise/zh/doc/EDOC1100421950/b809570c#fig1846161118561)所示，如果标签发布方式为DoD，且标签分配控制方式为Independent，则发送标签请求的LSR（Ingress）的直连下游（Transit）会直接回应标签，而不必等待来自最终下游（Egress）的标签。
- 有序标签分配控制（Ordered），指对于LSR上某个FEC的标签映射，只有当该LSR已经具有此FEC下一跳的标签映射消息、或者该LSR就是此FEC的出节点时，该LSR才可以向上游发送此FEC的标签映射。
  - 如[图1 DU方式](https://support.huawei.com/enterprise/zh/doc/EDOC1100421950/b809570c#fig144124113415)所示，如果标签发布方式为DU，且标签分配控制方式为Ordered，则LSR（Transit）只有收到下游（Egress）的标签映射消息，才会向上游（Ingress）分发标签。
  - 如[图2 DoD方式](https://support.huawei.com/enterprise/zh/doc/EDOC1100421950/b809570c#fig1846161118561)所示，如果标签发布方式为DoD，且标签分配控制方式为Ordered，则发送标签请求的LSR（Ingress）的直连下游（Transit）只有收到最终下游（Egress）的标签映射消息，才会向上游（Ingress）分发标签。

## 标签保持方式

标签保持方式（Label Retention Mode）是指LSR对来自非优选下一跳的标签映射的处理方式。LSR收到的标签映射可能来自下一跳，也可能来自非下一跳。标签保持方式可以分为以下两种：

- 自由标签保持方式（Liberal），是指对于从邻居LSR收到的标签映射，无论邻居LSR是不是自己的下一跳都保留。
- 保守标签保持方式（Conservative），是指对于从邻居LSR收到的标签映射，只有当邻居LSR是自己的下一跳时才保留。

当网络拓扑变化引起下一跳邻居改变时：

- 用自由标签保持方式，LSR可以直接利用原来非下一跳邻居发来的标签，迅速重建LSP，但需要更多的内存和标签空间。已经被分配标签，但是没有建立成功的LSP叫做Liberal LSP。
- 使用保守标签保持方式，LSR只保留来自下一跳邻居的标签，节省了内存和标签空间，但LSP的重建会比较慢。保守标签保持方式通常与DoD方式一起，用于标签空间有限的LSR。