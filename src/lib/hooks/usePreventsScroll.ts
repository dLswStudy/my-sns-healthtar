import {allowScroll, preventScroll} from "@/lib/utils";
import { useEffect } from "react"
const usePreventScroll = (open: boolean) => {
    useEffect(() => {
        if (open) {
            const prevScrollY = preventScroll()
            return () => {
                allowScroll(prevScrollY)
            }
        } else {
            document.documentElement.style.scrollBehavior = "smooth"
        }
    }, [open])
}

export default usePreventScroll