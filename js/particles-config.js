/**
 * Particles Configuration Module
 * Creates a connected network triangles background effect
 * Uses tsParticles library for background particles
 */

const ParticlesConfig = {
    config: {
        fpsLimit: 60,
        particles: {
            number: {
                value: 60,
                density: {
                    enable: true,
                    area: 800
                }
            },
            color: {
                value: ["#00d4ff", "#17A2C8", "#00e676"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5
            },
            size: {
                value: { min: 1, max: 3 }
            },
            links: {
                enable: true,
                distance: 150,
                color: "#00d4ff",
                opacity: 0.3,
                width: 1,
                triangles: {
                    enable: true,
                    color: "#00d4ff",
                    opacity: 0.05
                }
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
                straight: false,
                outModes: {
                    default: "bounce"
                }
            }
        },
        interactivity: {
            detectsOn: "canvas",
            events: {
                onHover: {
                    enable: true,
                    mode: "grab"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5
                    }
                }
            }
        },
        detectRetina: true,
        background: {
            color: "transparent"
        }
    },

    async init() {
        if (typeof tsParticles !== 'undefined') {
            try {
                await tsParticles.load("tsparticles", this.config);
            } catch (error) {
                console.warn('Failed to initialize particles:', error);
            }
        }
    }
};
