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

---

## Sprint 3 — Write-up & Polish
**Dates:** ~11 May – 16 May  
**Goal:** All written sections complete, PDF assembled and reviewed, submitted on time.

 | Points         | Criteria                                       |
|----------------|------------------------------------------------|
| 3 to >2.0 Pts  | Correct: Correct layer is identified and integrity explanation is accurate. |
| 2 to >1.0 Pts  | Partial correct: Correct layer is identified and integrity explanation is presented to some extent. |
| 1 to >0 Pts    | Incorrect: Poor knowledge about integrity check. |

## Frame Checking Sequence Explanation
The frame check sequence is a simple error detection method where the CRC algorithm is used to validate the data integrity of the frame. The CRC algorithm takes the numeric binary value of the entire frame and divides it by a fixed binary divisor, determined by the network standard being used, appending