import { loader } from "cc";

/** 最大并行加载数量 */
const ParallelMaxTextures = 10

/** 所有Textures资源名 */
let allTextures: string[] = [
    "bg_black_common",
    "bg_white_common",
    "bg_black_transparency_30",
    "bg_black_transparency_50",
    "bg_black_transparency_80",
    "ui_jupiterocean",
    "ui_logo",
    "ui_club_logo",
    "ui_fill_back",
    "ui_fill_handle",
    "ui_fill_img",
    "ui_btn_img1",
    "ui_btn_img2",
    "ui_btn_img3",
    "bg_jupiterocean",
    "bg_menu",
    "btn_menu_hover",
    "btn_menu_normal"
]

/** 加载所有纹理 */
export async function loadTextures() {
    let some = allTextures.splice(0, ParallelMaxTextures);

    if (some.length <= 0) return;

    await Promise.all(some.map(async u => {
        u = 'textures/' + u
        new Promise(resolve => {
            loader.loadRes(u, (err, a) => {
                resolve(null)
            })
        })
    }))

    /** 未加载完成间隔60ms再次加载 */
    if (allTextures.length) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null)
            }, 60)
        })
        await loadTextures();
    }
}
