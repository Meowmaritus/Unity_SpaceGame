Shader "Terrain/AlphaBlended" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_DetailTex ("Detail (RGB)", 2D) = "white" {}
		_BlendMap ("BlendMap (RGBA)", 2D) = "white" {}
		_LightMap ("LightMap (RGB)", 2D) = "white" {}
	}
	SubShader {
		Pass {
			Material {
				Diffuse (1,1,1,1)
				Ambient (1,1,1,1)
			}
			Lighting On
			
			SetTexture [_BlendMap] {
				combine texture
			}
			
			SetTexture [_DetailTex] {
				combine texture * previous
			}

			SetTexture [_MainTex] {
				combine previous lerp (previous) texture
			}
			
			SetTexture [_LightMap] {
				combine previous * texture
			}
			
			SetTexture [_Lightmap] {
				combine previous * primary
			}
		}
	} 
	FallBack "Diffuse", 1
}
