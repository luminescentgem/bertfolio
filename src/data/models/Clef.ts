export enum ClefKind { G = "G", F = "F", C = "C" }

export type Clef = {
  kind: ClefKind;          // G/F/C
  line: 1|2|3|4|5;         // staff line
  octaveShift: -2|-1|0|1|2; // 8vb = -1, 15vb = -2, 8va = +1, etc.
};