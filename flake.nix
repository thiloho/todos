{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_20
      ];
    };
    packages.${system}.default = pkgs.buildNpmPackage {
      name = "build-todos-application";
      src = ./.;
      npmDepsHash = "sha256-71tq5+2OsZF0AZLoOaEF5uKkCVIDeIFPifnRfpC2FtY=";
      installPhase = ''
        mkdir $out
        cp -r build/* $out
        cp package.json $out
        cp -r node_modules $out
      '';
    };
  };
}