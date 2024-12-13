{
    description = "A CLI tool (risma) for finding research papers quickly.";

    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
        flakeUtils.url = "github:numtide/flake-utils";
    };

    outputs = { self, nixpkgs, flakeUtils }:
        flakeUtils.lib.eachDefaultSystem (system:
            let
                pkgs = nixpkgs.legacyPackages.${system};
                risma = (pkgs.callPackage
                    (builtins.import ./default.nix)
                    {
                    }
                );
            in
                {
                    packages = {
                        risma = risma;
                        default = risma;
                    };
                }
        );
}
