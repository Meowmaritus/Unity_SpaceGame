var WaveSpeed : float = 0.1;
private var WaveValue : float = 0.0;

function Update () {
	WaveValue += Time.deltaTime * WaveSpeed;
	renderer.material.SetFloat( "_WindTime", WaveValue );
}