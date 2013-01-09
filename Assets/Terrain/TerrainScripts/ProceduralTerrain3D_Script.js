var BaseMeshResolution : int = 3;
var TerrainSubdivisions : int = 5;
var TerrainSize : float = 100.0;
var TerrainAmplitude : float = 1.0;
var NoiseAmplitude : float = 0.1;
var MeshMaterial : Material;
var ShadowProjectorMaterial : Material;
var ShadowProjector : Projector;
var LightmapSunAngle : Vector3 = Vector3( 500,-200,0);

private var PointArray : Array = new Array();

function Start () {
	PointArray = Create2DArray( BaseMeshResolution );
	PointArray = AddNoise( PointArray, TerrainAmplitude );
	
	for ( var ii = 0; ii < TerrainSubdivisions; ii ++ ) {
		PointArray = Subdivide( PointArray );
		PointArray = AddNoise( PointArray, NoiseAmplitude / ( 2 * (ii+1) * (ii+1) ) );
	}
	
	var TerrainScale : float = TerrainSize / PointArray.length;
	for ( var Xnum = 1; Xnum < PointArray.length; Xnum += 1 ) {
		for ( var Ynum = 0; Ynum < PointArray.length; Ynum += 1) {
			var StartPoint : Vector3 = Vector3( (Xnum-1)*TerrainScale, PointArray[Xnum - 1][Ynum], Ynum*TerrainScale );
			var EndPoint : Vector3 = Vector3( Xnum*TerrainScale, PointArray[Xnum][Ynum], Ynum*TerrainScale );
			Debug.DrawLine( StartPoint, EndPoint, Color.red );	
		}
	}
	
	for ( var Xnum2 = 0; Xnum2 < PointArray.length; Xnum2 += 1 ) {
		for ( var Ynum2 = 1; Ynum2 < PointArray.length; Ynum2 += 1) {
			var StartPoint2 : Vector3 = Vector3( Xnum2*TerrainScale, PointArray[Xnum2][Ynum2-1], (Ynum2-1)*TerrainScale );
			var EndPoint2 : Vector3 = Vector3( Xnum2*TerrainScale, PointArray[Xnum2][Ynum2], Ynum2*TerrainScale );
			Debug.DrawLine( StartPoint2, EndPoint2, Color.red );	
		}
	}
	
	GenerateMesh( PointArray );
	GenerateTexture ( PointArray, 128 );
	GenerateLightmap ( 128, LightmapSunAngle, 5 );
	
}

function Create2DArray( Dimensions : int ) : Array {
	var TemporaryArray : Array = new Array();
	
	for ( var Xnum = 0; Xnum < Dimensions; Xnum ++ ) {
		TemporaryArray[Xnum] = new Array();
		for ( var Ynum = 0; Ynum < Dimensions; Ynum ++ ) {
			TemporaryArray[Xnum][Ynum] = 0.0;
		}
	}
	
	return TemporaryArray;
}

function Subdivide ( ArrayName : Array) : Array {
	
	var Dimensions : int = (ArrayName.length * 2) - 1;
	var TemporaryPoints : Array = Create2DArray( Dimensions );
	
	for ( var CopyXnum = 0; CopyXnum < Dimensions; CopyXnum += 2 ) {
		for ( var CopyYnum = 0; CopyYnum < Dimensions; CopyYnum += 2) {
			TemporaryPoints[CopyXnum][CopyYnum] = ArrayName[CopyXnum/2][CopyYnum/2];
		}
	}
	
	for ( var LineAverageXnum = 0; LineAverageXnum < Dimensions-1; LineAverageXnum += 1 ) {
		for ( var LineAverageYnum = 0; LineAverageYnum < Dimensions-2; LineAverageYnum += 2) {
			if ( LineAverageXnum % 2 == 0 ) {
				var AverageValueEven = (TemporaryPoints[LineAverageXnum][LineAverageYnum] + TemporaryPoints[LineAverageXnum][LineAverageYnum+2])/2;
				TemporaryPoints[LineAverageXnum][LineAverageYnum+1] = AverageValueEven;
			}else{
				var AverageValueOdd = (TemporaryPoints[LineAverageXnum-1][LineAverageYnum] + TemporaryPoints[LineAverageXnum+1][LineAverageYnum])/2;
				TemporaryPoints[LineAverageXnum][LineAverageYnum] = AverageValueOdd;
			}
		}
	}
	
	for ( var MidAverageXnum = 1; MidAverageXnum < Dimensions-1; MidAverageXnum += 2 ) {
		for ( var MidAverageYnum = 1; MidAverageYnum < Dimensions-1; MidAverageYnum += 2) {
			var AverageValueMidpoint = (TemporaryPoints[MidAverageXnum-1][MidAverageYnum] + TemporaryPoints[MidAverageXnum+1][MidAverageYnum] + 
								TemporaryPoints[MidAverageXnum][MidAverageYnum-1] + TemporaryPoints[MidAverageXnum][MidAverageYnum+1]) / 4;
								
			TemporaryPoints[MidAverageXnum][MidAverageYnum] = AverageValueMidpoint;
			
		}
	}
	
	return TemporaryPoints;
}

function AddNoise( ArrayName : Array, NoiseValue : float ) {
	
	var TempArray : Array = ArrayName;
	
	for ( var Xnum = 0; Xnum < TempArray.length-1; Xnum ++ ) {
		for ( var Ynum = 0; Ynum < TempArray.length-1; Ynum ++ ) {
			TempArray[Xnum][Ynum] += Random.Range( -NoiseValue, NoiseValue );
		}
	}
	
	return TempArray;

}

function GenerateMesh( ArrayName : Array ) {
	gameObject.AddComponent(MeshFilter);
	gameObject.AddComponent("MeshRenderer");
	var NewCollider = gameObject.AddComponent(MeshCollider);
	
	var NewMesh : Mesh = GetComponent(MeshFilter).mesh;
	var MeshVertices = new Vector3[ArrayName.length * ArrayName.length];
	var MeshTriangles = new int[(ArrayName.length - 1) * (ArrayName.length - 1) * 6];
	var MeshUVS = new Vector2[ArrayName.length * ArrayName.length];
	
	var TerrainScale : float = TerrainSize / PointArray.length;
	
	for (var Xnum = 0; Xnum < ArrayName.length; Xnum ++ ) {
		for (var Ynum = 0; Ynum < ArrayName.length; Ynum ++ ) {
			MeshVertices[Ynum*ArrayName.length + Xnum] = Vector3( Xnum*TerrainScale, ArrayName[Xnum][Ynum], Ynum*TerrainScale );
		}
	}
	
	var index = 0;
	for (var triX=0; triX < ArrayName.length-1; triX++) {
		for (var triY=0; triY < ArrayName.length-1; triY++) {
			// For each grid cell there are two triangles
			MeshTriangles[index++] = (triY     * ArrayName.length) + triX;
			MeshTriangles[index++] = ((triY+1) * ArrayName.length) + triX;
			MeshTriangles[index++] = (triY     * ArrayName.length) + triX + 1;

			MeshTriangles[index++] = ((triY+1) * ArrayName.length) + triX;
			MeshTriangles[index++] = ((triY+1) * ArrayName.length) + triX + 1;
			MeshTriangles[index++] = (triY     * ArrayName.length) + triX + 1;
		}
	}
	
	var UVScaleFactor : float = (1.0 / (ArrayName.length-1));
	for (var UVXnum = 0; UVXnum < ArrayName.length; UVXnum ++ ) {
		for (var UVYnum = 0; UVYnum < ArrayName.length; UVYnum ++ ) {
			MeshUVS[UVYnum*ArrayName.length + UVXnum] = Vector3( UVXnum * UVScaleFactor, UVYnum * UVScaleFactor );
		}
	}
	
	NewMesh.vertices = MeshVertices;
	NewMesh.triangles = MeshTriangles;
	NewMesh.uv = MeshUVS;
	NewCollider.mesh = NewMesh;
	renderer.material = MeshMaterial;
	
	NewMesh.RecalculateNormals();
	NewMesh.RecalculateBounds();
}

function GenerateTexture ( TerrainArray : Array, TextureResolution : float ) {
	
	var NewBlendMap : Texture2D = new Texture2D( TerrainArray.length, TerrainArray.length );
	//var TexToHeightFactor : float = 1.0;//( TerrainArray.length / TerrainArray.length );
	
	for (var TextureXnum=0; TextureXnum < TerrainArray.length; TextureXnum++) {
		for (var TextureYnum=0; TextureYnum < TerrainArray.length; TextureYnum++) {
			
			var CombineValue : float = TerrainArray[ (TextureXnum) ][ (TextureYnum) ] / TerrainAmplitude;
			var NewColor : Color = Color( 1,1,1, CombineValue );
									
			NewBlendMap.SetPixel( TextureXnum, TextureYnum, NewColor );
			
		}
	}

	NewBlendMap.Apply();
	renderer.material.SetTexture( "_BlendMap" , NewBlendMap );

}

function GenerateLightmap ( LightmapResolution : int, LightAngle : Vector3, SmoothPasses : int ) {

	var NewLightmap : Texture2D = new Texture2D( LightmapResolution, LightmapResolution );
	
	var ScaleFactor : float = (TerrainSize/LightmapResolution);
	for (var Xnum=0; Xnum < LightmapResolution; Xnum++) {
		for (var Ynum=0; Ynum < LightmapResolution; Ynum++) {
			
			var StartPosition : Vector3 = Vector3( Xnum*ScaleFactor, 0, Ynum*ScaleFactor );
			var hit : RaycastHit;
			
			if ( Physics.Raycast( StartPosition - LightAngle * 1000, LightAngle, hit, 5000000 ) ) {			
				NewLightmap.SetPixel( hit.textureCoord.x * LightmapResolution, hit.textureCoord.y * LightmapResolution, Color.white );
			}
			
			Debug.DrawLine( StartPosition - LightAngle, hit.point, Color.yellow );
			
		}
	}
	NewLightmap.Apply();
	renderer.material.SetTexture( "_LightMap", NewLightmap );
	
	//////////// DONE WITH INITIAL COMPUTATION, FOLLOWING CODE BLURS THE LIGHTMAP
	
	for ( var passNum = 0; passNum < SmoothPasses; passNum ++ ) {
		for ( var Xpos = 0; Xpos < LightmapResolution; Xpos ++ ) {
			for ( var Ypos = 0; Ypos < LightmapResolution; Ypos ++ ) {
				
				var AverageValue = NewLightmap.GetPixel(Xpos, Ypos).r;
				var ValuesAveraged = 1;
				
				if (Xpos +1 < LightmapResolution) {
					AverageValue += NewLightmap.GetPixel(Xpos+1, Ypos).r;
					ValuesAveraged ++;
				}
				if (Xpos -1 > 0) {
					AverageValue += NewLightmap.GetPixel(Xpos-1, Ypos).r;
					ValuesAveraged ++;
				}
				if (Ypos +1 < LightmapResolution) {
					AverageValue += NewLightmap.GetPixel(Xpos, Ypos+1).r;
					ValuesAveraged ++;
				}
				if (Ypos -1 > 0) {
					AverageValue += NewLightmap.GetPixel(Xpos, Ypos-1).r;
					ValuesAveraged ++;
				}
				
				AverageValue /= ValuesAveraged;
				NewLightmap.SetPixel(Xpos, Ypos, Color( AverageValue, AverageValue, AverageValue, 1 ));
			
			}
		}
	}
	
	NewLightmap.Apply();
	renderer.material.SetTexture( "_LightMap", NewLightmap );

	//////////// DONE WITH BLURRING COMPUTATION, FOLLOWING CODE CREATES A PROJECTOR TO CAST SHADOWS ON OTHER OBJECTS
	
	//var ShadowProjector = gameObject.AddComponent( Projector );	
	ShadowProjector.orthographic = true;
	ShadowProjector.orthographicSize = TerrainSize;
	ShadowProjector.material = ShadowProjectorMaterial;
	ShadowProjector.material.SetTexture( "_ShadowTex",NewLightmap );
}