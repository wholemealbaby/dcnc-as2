**Marks:** 2 · **Tags:** theory, report

**Description:**  
Using a concrete real-world example, discuss how to trade off reliable data transmission against minimising latency when selecting a transport layer protocol. Explain why TCP is preferred for reliability-critical applications and why UDP is preferred for latency-sensitive applications, citing the specific scenario chosen.

**Acceptance Criteria:**
- A specific, concrete real-world scenario is used (e.g., video streaming vs file download vs VoIP).
- The trade-off between TCP reliability (retransmission, ordering) and UDP low-latency (no handshake, no retransmit) is clearly articulated.
- The response explains why the chosen scenario favours one protocol over the other.
- The answer is concise and directly addresses the transport layer without introducing irrelevant content.

| Points          | Criteria                                                                                      |
|-----------------|-----------------------------------------------------------------------------------------------|
| 2 to >1.0 Pts   | Correct accurate understanding about TCP and UDP, and the trade-off aligns with real-world applications. |
| 1 to >0 Pts     | Partial correct or incorrect understanding TCP and UDP, and/or the resource utilization for trade-off.   |
| 2 pts           |                                                                                               |

When transmitting data there is an inherent tradeoff between reliability and latency. For a connection to be reliable the sender must ensure the data is received uncorrupted. However, confirming this requires a response from the receiver, introducing latency that may increase depending on the size of the data. Now, let us consider the use case of a video conference livestream. If TCP was used, waiting for the receiver to verify that each packet is received uncorrupted would make continuously streaming video slow and conversation between participants impossible due unbearable latency. This is why UDP is the standard for live streaming; it drops the handshake, discards out of sequence packets and never retransmits, leaving the application to fill in the gaps. The absence of a handshake and sequence buffering significantly reduces latency but frames are discarded and lost more frequently. This tradeoff is necessary for the user experience in livestreaming, especially for two way communication. Conversely, the use of TCP for downloading a video would be more appropriate to make sure that all downloaded packets are captured and sequenced to form the complete file. UDP would not be appropriate for this type of download because the received data is not guaranteed to be complete and packets that are received out of sequence would be dropped and may not be retransmitted.