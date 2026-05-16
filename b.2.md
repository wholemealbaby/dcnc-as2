# B.2 Explain FCS
**Marks:** 3 · **Tags:** theory, report

**Description:**  
Identify which layer of the TCP/IP model is responsible for the FCS mechanism. Using the diagram created in B.1 as a reference, explain how integrity is ensured at that layer. Discuss what happens when the FCS check fails, including any error handling or frame-dropping behaviour.

**Acceptance Criteria:**
- The correct TCP/IP layer (Network Access / Link layer) is identified for FCS.
- The answer references the B.1 diagram explicitly.
- An explanation of how integrity is maintained at the link layer is provided (e.g., discard corrupt frames, request retransmission at a higher layer).
- The consequence of a failed FCS check is accurately described.
- The response is clearly written and technically accurate.

| Points         | Criteria                                       |
|----------------|------------------------------------------------|
| 3 to >2.0 Pts  | Correct: Correct layer is identified and integrity explanation is accurate. |
| 2 to >1.0 Pts  | Partial correct: Correct layer is identified and integrity explab anation is presented to some extent. |
| 1 to >0 Pts    | Incorrect: Poor knowledge about integrity check. |


The **Frame Check Sequence (FCS)** is a trailer field in frames of the **Network Access Layer** of the TCP/IP model, specifically in the **MAC (Media Access Control) sublayer**. The NIC hardware handles CRC computation and FCS validation on-the-fly as frames are transmitted and received; no higher-layer software is involved in the per-hop integrity check.

The B.1 diagram illustrates the receiver's error-checking process. Referring to that flow:
1. FCS integrity is checked using the process defined in B.1 by **every intermediate Network Access Layer node** (switch, router interface) that receives the frame, not just at the final destination.
2. The CRC algorithm is designed so that when the receiver divides the entire incoming bit-string (data + FCS) by the generator polynomial, a **zero remainder** signals an intact frame. This is the "Yes (No errors)" branch in the B.1 diagram, leading to the frame being accepted and passed up the stack.
3. If the B.1 diagram's comparison yields a non-zero remainder (the "No (Corruption detected)" branch), the frame is silently dropped because the network access layer adheres to the end-to-end principle and is designed with a best effort quality of service policy. The principle delegates reliability and security measures to the upper layers and communicating end nodes rather than the nodes contingent to Layer 2. Wired connections are usually dropped silently while wireless connections will locally retransmit within Layer 2 if an acknowledgment isn't received but will eventually give up if left unanswered. Recovery is then delegated to the relevant transport-layer protocol. If TCP, the receiving host's TCP stack will notice a gap in sequence numbers and trigger retransmission via duplicate ACKs or a timeout; if UDP, recovery is delegated to the application. 

**Acceptance Criteria:**
- [x] The correct TCP/IP layer (Network Access / Link layer) is identified for FCS.
- [x] The answer references the B.1 diagram explicitly.
- [x] An explanation of how integrity is maintained at the link layer is provided (e.g., discard corrupt frames, request retransmission at a higher layer).
- [x] The consequence of a failed FCS check is accurately described.
- [x] The response is clearly written and technically accurate.
