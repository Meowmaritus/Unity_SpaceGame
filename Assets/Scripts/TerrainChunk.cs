using UnityEngine;
using System.Collections;

public class TerrainChunk : MonoBehaviour {
    public PlayerHandler Player;
    public World world;
    public Vector2 TerrainResolutionSize;

	// Use this for initialization
	void Start () {
        GenerateTerrain();
	}

    public void GenerateTerrain()
    {
        if (GetComponent<Terrain>())
        {
            GenerateHeights(transform.position, GetComponent<Terrain>());
        }
    }

    private void GenerateHeights(Vector3 origin, Terrain terrain)
    {
        float[,] heights = new float[terrain.terrainData.heightmapWidth, terrain.terrainData.heightmapHeight];

        for (int i = 0; i < terrain.terrainData.heightmapWidth; i++)
        {
            for (int k = 0; k < terrain.terrainData.heightmapHeight; k++)
            {
                //heights[i, k] = Mathf.PerlinNoise(origin.x + ((i / terrain.terrainData.heightmapWidth) * TerrainResolutionSize.x), origin.z + ((k / terrain.terrainData.heightmapHeight) * TerrainResolutionSize.y)) * HeightMult;

                try
                {
                    heights[i, k] = GetPerlinValue((int)(origin.x + ((i / terrain.terrainData.heightmapWidth) * TerrainResolutionSize.x)), (int)(origin.z + ((k / terrain.terrainData.heightmapHeight) * TerrainResolutionSize.y)), (int)(terrain.terrainData.heightmapWidth / i), (int)(terrain.terrainData.heightmapHeight / k), 0.0625f, 1, 0.5f, 16, GenerateNoise(world.Seed, terrain.terrainData.heightmapWidth, terrain.terrainData.heightmapHeight));
                }
                catch
                {

                }
            }
        }

        terrain.terrainData.SetHeights(0, 0, heights);
    }
	
	// Update is called once per frame
    void FixedUpdate()
    {
        if (Main.Paused == false)
        {
            DoFixedUpdate();
        }
        else if (Main.Paused == true)
        {
            DoFixedUpdate_Paused();
        }
    }

    void Update()
    {
        if (Main.Paused == false)
        {
            DoUpdate();
        }
        else if (Main.Paused == true)
        {
            DoUpdate_Paused();
        }
    }

    void DoUpdate()
    {
        if (Input.GetKeyDown(KeyCode.F5))
        {
            GenerateTerrain();
        }
    }

    void DoUpdate_Paused()
    {

    }

    void DoFixedUpdate()
    {

    }

    void DoFixedUpdate_Paused()
    {

    }

    private float GetPerlinValue(int X, int Y, int Width,int Height,float Frequency, float Amplitude,
        float Persistance, int Octaves,float[,]Noise)
    {
        float FinalValue = 0.0f;

        for (int i = 0; i < Octaves; ++i)
        {
            FinalValue += GetSmoothNoise(X * Frequency, Y * Frequency,Width,Height,Noise) * Amplitude;
            Frequency *= 2.0f;
            Amplitude *= Persistance;
        }

        if (FinalValue < -1.0f)
        {
            FinalValue = -1.0f;
        }

        else if (FinalValue > 1.0f)
        {
            FinalValue = 1.0f;
        }

        return FinalValue;
    }


    private float GetSmoothNoise(float X, float Y,int Width,int Height,float[,]Noise)
    {
        float FractionX = X - (int)X;
        float FractionY = Y - (int)Y;
        int X1 = ((int)X + Width) % Width;
        int Y1 = ((int)Y + Height) % Height;
        int X2 = ((int)X + Width - 1) % Width;
        int Y2 = ((int)Y + Height - 1) % Height;

        float FinalValue = 0.0f;
        FinalValue += FractionX * FractionY * Noise[X1, Y1];
        FinalValue += FractionX * (1 - FractionY) * Noise[X1, Y2];
        FinalValue += (1 - FractionX) * FractionY * Noise[X2, Y1];
        FinalValue += (1 - FractionX) * (1 - FractionY) * Noise[X2, Y2];

        return FinalValue;
    }



    private float[,] GenerateNoise(int Seed,int Width,int Height)
    {
        float[,] Noise = new float[Width,Height];
        System.Random RandomGenerator = new System.Random(Seed);

        for (int x = 0; x < Width; ++x)
        {
            for (int y = 0; y < Height; ++y)
            {
                Noise[x, y] = ((float)(RandomGenerator.NextDouble()) - 0.5f) * 2.0f;
            }
        }

        return Noise;
    }

}
