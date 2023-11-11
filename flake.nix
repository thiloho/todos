{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs_20
      ];
    };
    packages.${system}.default = pkgs.buildNpmPackage {
      name = "build-todos-application";
      src = ./.;
      npmDepsHash = "sha256-mTpjBKTIJkYVj2jrH5lF/n3Axceak4L60ZDQECQhGew=";
      installPhase = ''
        mkdir $out
        cp -r build/* $out
      '';
    };
  };
}