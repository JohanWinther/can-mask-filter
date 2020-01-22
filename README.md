# Mask and filter calculator for CAN bus identifiers
This can be used as a quick reference to lookup which CAN frame identifiers will be caught by a certain mask and filter.
It supports 11-bit CAN 2.0A and 29-bit CAN 2.0B.

[This webpage](http://www.cse.dmu.ac.uk/~eg/tele/CanbusIDandMask.html) explains how it works:
> /.../ A receiving node would examine the identifier to decide if it was relevant (e.g. waiting for a frame with ID 00001567 which contains data to switch on or off a motor). It could do this via software (using a C if or case statement); in practice the Canbus interface contains firmware to carry out this task using the acceptance filter and mask value to filter out unwanted messages.
> The filter mask is used to determine which bits in the identifier of the received frame are compared with the filter
> - If a mask bit is set to a zero, the corresponding ID bit will automatically be accepted, regardless of the value of the filter bit.
> - If a mask bit is set to a one, the corresponding ID bit will be compare with the value of the filter bit; if they match it is accepted otherwise the frame is rejected.
