

interface UiState {
  // Navigation
  activeTab: PortfolioTab;            // "IT" | "Music" | "Poems"
  scrollPositions: Record<PortfolioTab, number>;

  // Note interaction
  hoveredNoteId: string | null;
  selectedNoteId: string | null;      // drives the popup
  popupState: PopupState;             // controls open/closing animation

  // Playback (post-MVP, but reserving space)
  playback: PlaybackState;
}

type PortfolioTab = "IT" | "Music" | "Poems";

type PopupState =
  | { status: "closed" }
  | { status: "closing"; noteId: string }   // animation out
  | { status: "open"; noteId: string };      // visible

interface PlaybackState {
  isPlaying: boolean;
  currentMeasureIndex: number;
  currentBeatPosition: number;
}