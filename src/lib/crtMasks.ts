export enum CRTMask {
	IBM = 'ibm',
	Trinitron = 'trinitron',
	Arcade = 'arcade',
	Commodore = 'commodore',
	Mac = 'mac'
}

export const CRT_MASK_PATHS: Record<CRTMask, string> = {
	[CRTMask.IBM]: '/crt-mask-ibm.svg',
	[CRTMask.Trinitron]: '/crt-mask-trinitron.svg',
	[CRTMask.Arcade]: '/crt-mask-arcade.svg',
	[CRTMask.Commodore]: '/crt-mask-commodore.svg',
	[CRTMask.Mac]: '/crt-mask-mac.svg'
};


export const CRT_BULGE_PATHS: Record<CRTMask, string> = {
	[CRTMask.IBM]: '/crt-bulge-ibm.svg',
	[CRTMask.Trinitron]: '/crt-bulge-trinitron.svg',
	[CRTMask.Arcade]: '/crt-bulge-arcade.svg',
	[CRTMask.Commodore]: '/crt-bulge-commodore.svg',
	[CRTMask.Mac]: '/crt-bulge-mac.svg'
};