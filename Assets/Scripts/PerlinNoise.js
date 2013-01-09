var scale : float = 1.0;
var recalculateNormals = true;

private var perlin : Perlin;

    function Start ()
    {
        for(var childPlane : Transform in transform) 
         MakePerlin(childPlane);
    }

    function MakePerlin(childPlane : Transform){

        var baseVertices : Vector3[];

        var mesh : Mesh = childPlane.GetComponent(MeshFilter).mesh;

        if (baseVertices == null)
        baseVertices = mesh.vertices;

        var vertices = new Vector3[baseVertices.Length];

        for (var i = 0; i < vertices.Length; i++)
        {
            var vertex = baseVertices[i];

            var worldPosition : Vector3 = childPlane.transform.TransformPoint(baseVertices[i]);

            vertex.y += perlin.Noise(worldPosition.x + 0.1, worldPosition.z + 0.1) * scale;

            vertices[i] = vertex;
        }

        mesh.vertices = vertices;

        if (recalculateNormals) 
        mesh.RecalculateNormals();

        mesh.RecalculateBounds();

        childPlane.GetComponent(MeshCollider).sharedMesh = null;
        childPlane.GetComponent(MeshCollider).sharedMesh = mesh;
    }