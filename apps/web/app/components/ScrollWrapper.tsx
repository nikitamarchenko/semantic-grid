import { Box } from "@mui/material";


const ScrollWrapper = ({ children }: { children: React.ReactNode }) => (<Box
    sx={{
      overflowX: 'auto',
      touchAction: 'pan-x',
    }}
  >
    <Box
      sx={{
        overflowY: 'auto',
        touchAction: 'pan-y',
        height: '100vh',
      }}
    >
      {children}
    </Box>
  </Box>)

export default ScrollWrapper;