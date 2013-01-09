using UnityEngine;
using System.Collections;

public class SpaceShip : MonoBehaviour {

    public Vector3 TestMoveVector = new Vector3(0, 0, 1);
    public Transform EnterTransform;
    public Transform ExitTransform;
    public PlayerHandler Player;
    private float SpeedMult = 1.0f;    
    private float oldSpeedMult = 1.0f;
    public float TurboSpeedMult = 5.0f;
    public float SpeedLerp = 0.5f;
    public bool HasPlayerInside = false;

	// Use this for initialization
	void Start () {
	
	}

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

    void OnMouseOver()
    {         
               
        if (!GetComponentInChildren<PlayerHandler>())
        {
            Player.StatusDisplay = "[E]: Enter Ship";

            if (Input.GetKeyDown(KeyCode.E))
            {
                Player.transform.parent = transform;
                Player.MoveTo(EnterTransform);
            }
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
	
	// Update is called once per frame
    void DoUpdate()
    {
        if (Player.transform.parent == transform)
        {
            HasPlayerInside = true;
        }
        else
        {
            HasPlayerInside = false;
        }

        GameGUI.DebugValue["SpaceShip.HasPlayerInside"] = HasPlayerInside;

        if (GetComponentInChildren<PlayerHandler>())
        {
            if (Input.GetKey(KeyCode.LeftControl))
            {
                SpeedMult = TurboSpeedMult;
            }
            else
            {
                SpeedMult = 1.0f;
            }

            Player.StatusDisplay = "[Q]: Exit Ship / [Ctrl]: Turbo";

            if (Input.GetKeyDown(KeyCode.Q))
            {
                Player.transform.parent = null;
                Player.MoveTo(ExitTransform);
            }
        }
        else
        {
            SpeedMult = 0.0f;
        }

        float smoothSpeedMult = Mathf.Lerp(SpeedMult, oldSpeedMult, SpeedLerp);
        transform.Translate(TestMoveVector * smoothSpeedMult, Space.Self);

        oldSpeedMult = SpeedMult;
    }

    void DoFixedUpdate()
    {

    }

    void DoUpdate_Paused()
    {
      
    }

    void DoFixedUpdate_Paused()
    {

    }
}
