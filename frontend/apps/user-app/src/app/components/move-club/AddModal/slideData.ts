// ***************************************************************
//                 IMPORTS
// ***************************************************************
import {
    faUsers,
    faHeart,
    faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { Slide } from './types';

// ***************************************************************
//                 Data
// ***************************************************************
export const slides: Slide[] = [
    {
        title: "What if your next \"networking event\" actually moved the needle?",
        content: [
            "What if you showed up to a networking event and left with real momentum?",
            "Where you connected with like-minded people, felt truly supported, cleared the fog, solved a problem — and ticked the thing off your list?",
            "",
            "That's exactly why we created The Sloane Move Club.",
            "",
            "An intentional space where you move your body, your business, your mind — and you move together.",
            "",
            "This isn't another chatty call.",
            "It's focused, high-vibe, human-led co-working — with a touch of mindfulness, a hit of clarity, and a room full of people doing the damn thing."
        ],
        icon: faUsers
    },
    {
        title: "Here's how it flows:",
        content: [
            "1. Set your intention.",
            "You'll start by declaring what you're here to complete. One thing. One goal. One solid move forward.",
            "",
            "2. Deep focus time.",
            "We work silently in sync. Everyone's in the zone. It's the kind of collective energy that helps you keep going when you'd normally check out.",
            "",
            "3. Breathe + reset.",
            "Every 50 minutes, we pause. A stretch, a breath, a nervous system-friendly reset — designed to help you keep your energy clean and clear.",
            "",
            "4. We begin with grounding.",
            "A short guided meditation opens the session so you can land, slow down, and step in with clarity.",
            "",
            "5. Support when you need it.",
            "If you're stuck, say the word. Drop it in the chat. Someone might help right there — or jump into a breakout with you to workshop and return. Real-time, heart-led support."
        ],
        icon: faHeart
    },
    {
        title: "Online. Intentional. Surprisingly human.",
        content: [
            "The Move Club is where smart business owners gather to get things done — without burning out, zoning out, or going it alone.",
            "",
            "It's about momentum with meaning.",
            "Focus with flow.",
            "Structure that feels like support — not pressure.",
            "",
            "Come join us.",
            "Move with us."
        ],
        icon: faGlobe
    }
];

// ***************************************************************
//                 EXPORTS
// ***************************************************************

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Slide data is separated from components for better maintainability
// - Each slide contains title, content array, and FontAwesome icon
// - Content arrays can include empty strings for spacing 