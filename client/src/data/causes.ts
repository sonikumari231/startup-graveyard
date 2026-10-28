import type { CauseKey } from "../types";

export const CAUSES: Record<CauseKey, { label: string; hue: number }> = {
  "market": {
    "label": "No market need",
    "hue": 215
  },
  "cash": {
    "label": "Ran out of cash",
    "hue": 35
  },
  "cost": {
    "label": "Costs beat revenue",
    "hue": 150
  },
  "product": {
    "label": "Product did not work",
    "hue": 285
  },
  "compete": {
    "label": "Outcompeted",
    "hue": 330
  },
  "timing": {
    "label": "Bad timing",
    "hue": 190
  },
  "fraud": {
    "label": "Fraud or deception",
    "hue": 5
  },
  "scale": {
    "label": "Scaled too fast",
    "hue": 60
  },
  "legal": {
    "label": "Legal or regulatory",
    "hue": 245
  },
  "focus": {
    "label": "Lost focus",
    "hue": 100
  },
  "growth": {
    "label": "Could not grow",
    "hue": 120
  },
  "model": {
    "label": "Weak business model",
    "hue": 20
  }
};
