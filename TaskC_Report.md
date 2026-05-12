# Data Communication And Net-Centric Computing Group Assignment 2
---
## Group member Details
#### Group No. 33:
Nikolas Papakalodoukas - s4094240  
Alexandre Lee - s4090276  
Thomas Gosling - s3850201  
Jayden Bolth - s4104354  

# Task A
(19 marks in total) Car Sales Melbourne City has recently relocated from Richmond. The company consists of four main departments: Marketing, Administration, IT, and Sales. Currently, each of Marketing, Administration and Sales departments has 40 staff, while the fast-growing IT department has 60 staff. Assume that the company has been assigned the IP address 192.100.30.0. As a networking engineer at Car Sales Melbourne City, your task is to complete the following assignments.


## Task A1
### A1 Specifications:
(9 marks) Please design Subnets 1, 2, 3 and 4 for the marketing department, product department, IT department, and sales department.
| Departments | Marketing | Administration | Sales | IT |
|---------|---------|---------|---------|---------|
| Requirements | 40 | 40 | 40 | 60 + fast growing |  
<br>
1. (5 marks) Specifically, you need to provide two different designs and explain your intuitions behind.

### Subnet Design 1
Design 1 utilises a FSLM approach, subdividing the network into 4 subnets of equal size, using 26 bits for the network address and giving each subnetwork a total of 62 hosts each. 

Since each department is provisioned with only 2 PCs by default, it is highly probable that Car Sales Melbourne City accomodates a BYOD (Bring Your Own Device) work environment, suggesting that staff will require IP addresses for multiple devices (e.g., laptop and smartphone). Because of this, Design 1 does not provide sufficient room for growth or a BYOD environment; with only 62 addresses per subnet and 40 staff per department, only 22 spare addresses remain. This is inadequate for the fast-growing IT department (which would have only 2 spare addresses) and cannot support multiple devices per person in a BYOD workplace.
| Subnet | Network Address | Usable IP Range | Broadcast Address | CIDR Prefix |
|---------|---------|---------|---------|---------|
|IT – Subnet 1|192.100.30.0|192.100.30.1-192.100.30.62|192.100.30.63|/26|
|Marketing - Subnet 2|192.100.30.64|192.100.30.65-192.100.30.126|192.100.30.127|/26|
|Administration -  Subnet 3|192.100.30.128|192.100.30.129-192.100.30.190|192.100.30.191|/26|
|Sales - Subnet  4|192.100.30.192|192.100.30.193-192.100.30.254|192.100.30.255|/26|
### Subnet Design 2: Supernet Configuration

The IP address assigned to Car Sales Melbourne City, [`192.100.30.0`](https://www.ripe.net/publications/docs/ripe-504/), is a public Class C address belonging to RIPE NCC (Réseaux IP Européens Network Coordination Centre) (RIPE NCC, 2026). By default, a Class C address implies a `/24` subnet mask, providing 255 total addresses (254 usable). However, given the staffing requirements across all four departments, a total of 180 staff require network access: 60 staff in IT and 40 each in Marketing, Administration, and Sales. This represents approximately 70% utilisation of the 255 available addresses if one device per person is assumed.

Furthermore, RIPE NCC stipulates that 80% of a reasonable allocation must be utilised before additional allocations can be granted (RIPE NCC, 2026). The aforementioned BYOD environment justifies the 80% minimum requirement for additional allocation, as the actual address demand per person is likely to exceed one device.

Given these considerations, a /23 supernet (512 addresses) is necessary. However, even 512 addresses may not be sufficient to accommodate at least 2 devices per person (computer and phone) across all departments simultaneously. Therefore, additional measures such as IP address recycling (reclaiming addresses from less frequently used devices) will need to be employed to manage the address space efficiently.

To accommodate this, we must request permission from our ISP to supernet (i.e., obtain a larger CIDR block). RIPE NCC policy requires that at least 50% of the current allocation must be utilised within one year, otherwise the allocation may be downgraded (RIPE NCC, 2026b). Assuming two devices per person, the 70% utilisation threshold is comfortably exceeded, justifying the need for additional address space.

The supernet configuration is as follows:

| Department | Staff (Needed) | Allocated IPs | CIDR | Network Address | Usable Range | Broadcast Address |
|------------|---------------|---------------|------|----------------|--------------|-------------------|
| IT | 60 | 126 | /25 | 192.100.30.0 | 192.100.30.1 – .126 | 192.100.30.127 |
| Marketing | 40 | 62 | /26 | 192.100.30.128 | 192.100.30.129 – .190 | 192.100.30.191 |
| Admin | 40 | 62 | /26 | 192.100.30.192 | 192.100.30.193 – .254 | 192.100.30.255 |
| Sales | 40 | 62 | /26 | 192.100.31.0 | 192.100.31.1 – .62 | 192.100.31.63 |

This configuration allocates a `/25` (126 usable addresses) to the fast-growing IT department, providing ample room for expansion, while each of the remaining three departments receives a `/26` (62 usable addresses). The supernet spans from `192.100.30.0/23` to `192.100.31.255/23`, effectively aggregating the four subnets under a single supernet prefix.

### 2. (2 marks) Compare those two designs by the advantages and disadvantages and explain which one is better in your opinion.
| Design # | Advantages | Disadvantages |
|---------|---------|---------|
| Subnet Design 1 | Allows growth (of about 22 users) for Marketing, Admin & Sales, Evenly spreads out the allocation per department | 'Fast Growing' IT department does not have much scalability only having 2 free slots; completely unsuitable for a BYOD environment as the limited address space per subnet cannot accommodate multiple devices per person; definitively lacks capacity for organisational growth, meaning the IT department's 2 spare slots are exhausted immediately, and the 22 spare slots across the other three departments cannot cover even one additional device per staff member |
| Subnet Design 2 (Supernet) | IT department receives a /25 (126 addresses) with 66 spare slots for growth; Marketing, Admin, and Sales each receive a /26 (62 addresses) with 22 spare slots each; the /23 supernet (512 addresses) provides substantial headroom for BYOD; capable of supporting at least 2 devices per person across all departments; aligns with RIPE NCC utilisation policies for additional allocation | Requires ISP permission to supernet beyond the default /24; even 512 addresses may not be sufficient if every staff member uses more than 2 devices simultaneously, necessitating additional measures such as IP address recycling |

In my Opinion, Subnet Design 2 (Supernet) is the superior choice. Design 1 is fundamentally flawed for this organisation because it allocates only 62 addresses per subnet, leaving the IT department with a mere 2 spare addresses and the other departments with 22 each. This is completely inadequate for a BYOD work environment, as even one additional device per person would immediately exhaust the IT subnet and severely strain the others. Design 1 therefore definitively fails to meet the organisation's current needs, let alone future growth, and is not a viable option.

In contrast, Design 2's supernet approach leverages a /23 block (512 addresses) obtained through ISP permission, justified by the 70% utilisation of the original /24 and the BYOD-driven demand for multiple devices per person. The IT department receives a /25 (126 addresses and 66 spare), while Marketing, Admin, and Sales each receive a /26 (62 addresses and 22 spare each). This configuration provides ample room for departmental growth and comfortably supports at least 2 devices per staff member. Furthermore, it aligns with RIPE NCC's 50% minimum utilisation policy (RIPE NCC, 2026b) and the 80% utilisation threshold for additional allocations (RIPE NCC, 2026b). While even 512 addresses may require IP address recycling for full 2-device-per-person coverage, Design 2 is the only option that provides a realistic and scalable foundation for a modern BYOD-enabled workplace.

### 3. (2 marks) Convert your student ID (one of the students) into binary by using the mod2 operation. Calculate the last 8 bit, i.e., X, to conduct your own IP address 192.100.30.X. Please draw the conversion, and indicated the potential host and department for your IP address.
###### Nikolas’ student ID: s4094240 ---> 4094240

Step 1: 4094240 mod 2 = 0, 2047120 \
Step 2: 2047120 mod 2 = 0, 1023560 \
Step 3: 1023560 mod 2 = 0, 511780 \
Step 4: 511780 mod 2 = 0, 255890 \
Step 5: 255890 mod 2 = 0, 127945 \
Step 6: 127945 mod 2 = 1, 63972 \
Step 7: 63972 mod 2 = 0, 31986 \
Step 8: 31986 mod 2 = 0, 15993 \
The first bit calculated it the least significant bit \
first 8 bits: 0 0 1 0 0 0 0 0 = 32 

IP address: 192.100.30.32

192.100.30.32 falls within the IT department subnet (192.100.30.0/25), which has usable hosts ranging from 192.100.30.1 to 192.100.30.126, and a broadcast address of 192.100.30.127.

## Task A2

# Task B
---


# References
---
