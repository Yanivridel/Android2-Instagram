import { Spinner } from "@/components/ui/spinner"
import colors from "tailwindcss/colors"
import { Box } from "./ui/box"

interface SpinnerLoaderProps {
    className?: string;
}
export default function SpinnerLoader({ className }: SpinnerLoaderProps) {
    return (
    <Box className={className}>
        <Spinner size="large" color={colors.indigo[500]} />
    </Box>
    )
}