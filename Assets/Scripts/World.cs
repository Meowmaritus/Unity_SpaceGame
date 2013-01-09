using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class World : MonoBehaviour {

    public int Seed = 1;
    //public GameObject TerrainToClone;
    //public PlayerHandler Player;
    //public Vector2 GridSize;
    //Vector2 CurrentPlayerGrid;
    //Vector2 OldPlayerGrid;
    //List<Vector2> OldPlayerGridPositions = new List<Vector2>();

	// Use this for initialization
	void Start () {
	
	}

	// Update is called once per frame
	void Update () {

        //CurrentPlayerGrid.x = (int)((int)(Player.transform.position.x / GridSize.x) * GridSize.x);
        //CurrentPlayerGrid.y = (int)((int)(Player.transform.position.z / GridSize.y) * GridSize.y);

        //GameGUI.DebugValue["World.CurrentPlayerGrid.x"] = CurrentPlayerGrid.x;
        //GameGUI.DebugValue["World.CurrentPlayerGrid.y"] = CurrentPlayerGrid.y;

        //if (CurrentPlayerGrid != OldPlayerGrid)
        //{
        //    AddNewChunkAtPlayerGrid(CurrentPlayerGrid);
        //}

        if (Input.GetKey(KeyCode.F2) == true)
        {
            Seed = Random.Range(0, 999999999);
        }

        //OldPlayerGrid = CurrentPlayerGrid;
	}    

    //void AddNewChunkAtPlayerGrid(Vector2 g)
    //{
    //    bool isNewPos = false;

    //    for (int i = 0; i < OldPlayerGridPositions.Count; i++)
    //    {
    //        isNewPos = (OldPlayerGridPositions[i].x != g.x && OldPlayerGridPositions[i].y != g.y);
    //    }

    //    if (isNewPos == true)
    //    {
    //        AddChunkFromGrid(g);
    //        OldPlayerGridPositions.Add(g);
    //    }        
    //}

    //void AddChunkFromGrid(Vector2 grid)
    //{
    //    Vector3 position = new Vector3(grid.x, 0, grid.y);
    //    Instantiate(TerrainToClone, position, transform.rotation);
    //}
}
