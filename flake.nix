{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_20
        nil
      ];
    };
    packages.${system}.default = pkgs.buildNpmPackage {
      name = "build-todos-application";
      src = ./.;
      npmDepsHash = "sha256-XOkCZKCEXduA31Thkk5W3It1AxgtJie2EcXHWN2HIxg=";
      installPhase = ''
        mkdir $out
        cp -r build/* $out
        cp package.json $out
        cp -r node_modules $out
      '';
    };
  };
}
