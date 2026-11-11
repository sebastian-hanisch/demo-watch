// Visits every Streamlit Community Cloud demo with a real headless-browser
// page load (not just a curl/HEAD request) so the app is treated as an
// actual visit and doesn't fall asleep from inactivity. If a demo is
// already asleep, clicks the "wake it back up" button and waits for the
// real reboot before checking the app rendered.
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const DEMO_URLS = [
  "https://sebastianhanisch-vrp-demo.streamlit.app/",
  "https://sebastianhanisch-pack-demo.streamlit.app/",
  "https://sebastianhanisch-freight-demo.streamlit.app/",
  "https://sebastianhanisch-transit-demo.streamlit.app/",
  "https://sebastianhanisch-dock-door-demo.streamlit.app/",
  "https://sebastianhanisch-truck-appointment-demo.streamlit.app/",
  "https://sebastianhanisch-order-batch-demo.streamlit.app/",
  "https://sebastianhanisch-shift-demo.streamlit.app/",
  "https://sebastianhanisch-ems-demo.streamlit.app/",
  "https://sebastianhanisch-nutrition-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-demo.streamlit.app/",
  "https://sebastianhanisch-battery-arbitrage-demo.streamlit.app/",
  "https://sebastianhanisch-warehouse-transfer-demo.streamlit.app/",
  "https://sebastianhanisch-network-flow-demo.streamlit.app/",
  "https://sebastianhanisch-linehaul-demo.streamlit.app/",
  "https://sebastianhanisch-quaycrane-demo.streamlit.app/",
  "https://sebastianhanisch-branch-bound-demo.streamlit.app/",
  "https://sebastianhanisch-dynamic-programming-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-planes-demo.streamlit.app/",
  "https://sebastianhanisch-branch-cut-demo.streamlit.app/",
  "https://sebastianhanisch-constraint-programming-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-branch-bound-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-dp-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-cutting-planes-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-branch-cut-demo.streamlit.app/",
  "https://sebastianhanisch-cutting-stock-constraint-programming-demo.streamlit.app/",
  "https://sebastianhanisch-column-generation-demo.streamlit.app/",
  "https://sebastianhanisch-branch-and-price-demo.streamlit.app/",
  "https://sebastianhanisch-berth-allocation-demo.streamlit.app/",
  "https://sebastianhanisch-vc-portfolio-demo.streamlit.app/",
  "https://sebastianhanisch-kmeans-demo.streamlit.app/",
  "https://sebastianhanisch-dbscan-demo.streamlit.app/",
  "https://sebastianhanisch-agglomerative-demo.streamlit.app/",
  "https://sebastianhanisch-hdbscan-demo.streamlit.app/",
  "https://sebastianhanisch-gmm-demo.streamlit.app/",
  "https://sebastianhanisch-dpmm-demo.streamlit.app/",
  "https://sebastianhanisch-spectral-demo.streamlit.app/",
  "https://sebastianhanisch-leiden-demo.streamlit.app/",
  "https://sebastianhanisch-divisive-demo.streamlit.app/",
  "https://sebastianhanisch-clubs-demo.streamlit.app/",
  "https://sebastianhanisch-gcpp-demo.streamlit.app/",
  "https://sebastianhanisch-yard-demo.streamlit.app/",
  "https://sebastianhanisch-contract-net-demo.streamlit.app/",
  "https://sebastianhanisch-task-swap-demo.streamlit.app/",
  "https://sebastianhanisch-dcop-demo.streamlit.app/",
  "https://sebastianhanisch-marl-demo.streamlit.app/",
  "https://sebastianhanisch-mappo-demo.streamlit.app/",
  "https://sebastianhanisch-auction-demo.streamlit.app/",
  "https://sebastianhanisch-regretnet-demo.streamlit.app/",
  "https://sebastianhanisch-ladcop-demo.streamlit.app/",
  "https://sebastianhanisch-pca-demo.streamlit.app/",
  "https://sebastianhanisch-isomap-demo.streamlit.app/",
  "https://sebastianhanisch-lle-demo.streamlit.app/",
  "https://sebastianhanisch-tsne-demo.streamlit.app/",
  "https://sebastianhanisch-umap-demo.streamlit.app/",
  "https://sebastianhanisch-pacmap-demo.streamlit.app/",
  "https://sebastianhanisch-autoencoder-demo.streamlit.app/",
  "https://sebastianhanisch-ica-demo.streamlit.app/",
  "https://sebastianhanisch-sobi-demo.streamlit.app/",
  "https://sebastianhanisch-sca-demo.streamlit.app/",
  "https://sebastianhanisch-nmf-demo.streamlit.app/",
  "https://sebastianhanisch-spike-sorting-demo.streamlit.app/",
  "https://sebastianhanisch-template-matching-demo.streamlit.app/",
  "https://sebastianhanisch-delay-graph-demo.streamlit.app/",
  "https://sebastianhanisch-elliptic-envelope-demo.streamlit.app/",
  "https://sebastianhanisch-ecod-demo.streamlit.app/",
  "https://sebastianhanisch-isolation-forest-demo.streamlit.app/",
  "https://sebastianhanisch-extended-isolation-forest-demo.streamlit.app/",
  "https://sebastianhanisch-lof-demo.streamlit.app/",
  "https://sebastianhanisch-feature-bagging-demo.streamlit.app/",
  "https://sebastianhanisch-ocsvm-demo.streamlit.app/",
  "https://sebastianhanisch-deepsvdd-demo.streamlit.app/",
  "https://sebastianhanisch-autoencoder-anomalie-demo.streamlit.app/",
  "https://sebastianhanisch-bfs-demo.streamlit.app/",
  "https://sebastianhanisch-dijkstra-demo.streamlit.app/",
  "https://sebastianhanisch-bidirectional-demo.streamlit.app/",
  "https://sebastianhanisch-contraction-hierarchies-demo.streamlit.app/",
  "https://sebastianhanisch-bellman-ford-demo.streamlit.app/",
  "https://sebastianhanisch-floyd-warshall-demo.streamlit.app/",
  "https://sebastianhanisch-johnson-demo.streamlit.app/",
  "https://sebastianhanisch-multicriteria-demo.streamlit.app/",
  "https://sebastianhanisch-time-dependent-demo.streamlit.app/",
  "https://sebastianhanisch-2hop-labeling-demo.streamlit.app/",
  "https://sebastianhanisch-customizable-ch-demo.streamlit.app/",
  "https://sebastianhanisch-raptor-demo.streamlit.app/",
  "https://sebastianhanisch-doppelspiel-demo.streamlit.app/",
  "https://sebastianhanisch-robuste-kaiplatz-demo.streamlit.app/",
  "https://sebastianhanisch-stauplanung-demo.streamlit.app/",
  "https://sebastianhanisch-fahrzeugflotte-demo.streamlit.app/",
  "https://sebastianhanisch-stapelplanung-demo.streamlit.app/",
  "https://sebastianhanisch-reefer-demo.streamlit.app/",
  "https://sebastianhanisch-blockzuweisung-demo.streamlit.app/",
  "https://sebastianhanisch-verweilzeit-demo.streamlit.app/",
  "https://sebastianhanisch-gate-demo.streamlit.app/",
  "https://sebastianhanisch-bahnladeplan-demo.streamlit.app/",
  "https://sebastianhanisch-lkw-fristen-demo.streamlit.app/",
  "https://sebastianhanisch-hofrobust-demo.streamlit.app/",
  "https://sebastianhanisch-hofstellplatz-demo.streamlit.app/",
  "https://sebastianhanisch-cart-demo.streamlit.app/",
  "https://sebastianhanisch-bagging-demo.streamlit.app/",
  "https://sebastianhanisch-random-forest-demo.streamlit.app/",
  "https://sebastianhanisch-extra-trees-demo.streamlit.app/",
  "https://sebastianhanisch-adaboost-demo.streamlit.app/",
  "https://sebastianhanisch-gradient-boosting-demo.streamlit.app/",
  "https://sebastianhanisch-xgboost-demo.streamlit.app/",
  "https://sebastianhanisch-lightgbm-demo.streamlit.app/",
  "https://sebastianhanisch-catboost-demo.streamlit.app/",
  "https://sebastianhanisch-greedy-matching-demo.streamlit.app/",
  "https://sebastianhanisch-augmenting-path-demo.streamlit.app/",
  "https://sebastianhanisch-hopcroft-karp-demo.streamlit.app/",
  "https://sebastianhanisch-hungarian-demo.streamlit.app/",
  "https://sebastianhanisch-auction-algorithm-demo.streamlit.app/",
  "https://sebastianhanisch-edmonds-matching-demo.streamlit.app/",
  "https://sebastianhanisch-weighted-edmonds-matching-demo.streamlit.app/",
  "https://sebastianhanisch-gale-shapley-demo.streamlit.app/",
  "https://sebastianhanisch-stabile-mitbewohner-demo.streamlit.app/",
  "https://sebastianhanisch-krankenhaus-zulassung-demo.streamlit.app/",
  "https://sebastianhanisch-top-trading-cycles-demo.streamlit.app/",
  "https://sebastianhanisch-nierentausch-demo.streamlit.app/",
  "https://sebastianhanisch-online-matching-demo.streamlit.app/",
  "https://sebastianhanisch-leercontainer-demo.streamlit.app/",
  "https://sebastianhanisch-mehrhafenstau-demo.streamlit.app/",
  "https://sebastianhanisch-slow-steaming-demo.streamlit.app/",
  "https://sebastianhanisch-revenue-management-demo.streamlit.app/",
  "https://sebastianhanisch-genetic-algorithm-demo.streamlit.app/",
  "https://sebastianhanisch-nsga2-demo.streamlit.app/",
  "https://sebastianhanisch-nsga3-demo.streamlit.app/",
  "https://sebastianhanisch-moead-demo.streamlit.app/",
  "https://sebastianhanisch-cma-es-demo.streamlit.app/",
  "https://sebastianhanisch-differential-evolution-demo.streamlit.app/",
  "https://sebastianhanisch-l-shade-demo.streamlit.app/",
  "https://sebastianhanisch-pso-demo.streamlit.app/",
  "https://sebastianhanisch-ant-system-demo.streamlit.app/",
  "https://sebastianhanisch-max-min-ant-system-demo.streamlit.app/",
  "https://sebastianhanisch-memetic-demo.streamlit.app/",
  "https://sebastianhanisch-routenresilienz-demo.streamlit.app/",
  "https://sebastianhanisch-hill-climbing-demo.streamlit.app/",
  "https://sebastianhanisch-simulated-annealing-demo.streamlit.app/",
  "https://sebastianhanisch-parallel-tempering-demo.streamlit.app/",
  "https://sebastianhanisch-iterated-local-search-demo.streamlit.app/",
  "https://sebastianhanisch-variable-neighborhood-search-demo.streamlit.app/",
  "https://sebastianhanisch-tabu-search-demo.streamlit.app/",
  "https://sebastianhanisch-grasp-demo.streamlit.app/",
  "https://sebastianhanisch-lin-kernighan-demo.streamlit.app/",
  "https://sebastianhanisch-dynasearch-demo.streamlit.app/",
  "https://sebastianhanisch-vrp-nachbarschaften-demo.streamlit.app/",
  "https://sebastianhanisch-alns-demo.streamlit.app/",
  "https://sebastianhanisch-wellenfreigabe-demo.streamlit.app/",
  "https://sebastianhanisch-greedy-best-first-demo.streamlit.app/",
  "https://sebastianhanisch-astar-demo.streamlit.app/",
  "https://sebastianhanisch-ida-star-demo.streamlit.app/",
  "https://sebastianhanisch-beam-search-demo.streamlit.app/",
  "https://sebastianhanisch-monobeam-demo.streamlit.app/",
  "https://sebastianhanisch-beam-stack-demo.streamlit.app/",
  "https://sebastianhanisch-diverse-beam-demo.streamlit.app/",
  "https://sebastianhanisch-mcts-demo.streamlit.app/",
  "https://sebastianhanisch-nash-demo.streamlit.app/",
  "https://sebastianhanisch-poa-braess-demo.streamlit.app/",
  "https://sebastianhanisch-maut-demo.streamlit.app/",
  "https://sebastianhanisch-noregret-demo.streamlit.app/",
  "https://sebastianhanisch-korreliert-demo.streamlit.app/",
  "https://sebastianhanisch-stackelberg-demo.streamlit.app/",
  "https://sebastianhanisch-shapley-demo.streamlit.app/",
  "https://sebastianhanisch-kern-demo.streamlit.app/",
  "https://sebastianhanisch-moulin-demo.streamlit.app/",
  "https://sebastianhanisch-myerson-satterthwaite-demo.streamlit.app/",
  "https://sebastianhanisch-gcn-demo.streamlit.app/",
  "https://sebastianhanisch-graphsage-demo.streamlit.app/",
  "https://sebastianhanisch-gat-demo.streamlit.app/",
  "https://sebastianhanisch-gatv2-demo.streamlit.app/",
  "https://sebastianhanisch-gin-demo.streamlit.app/",
  "https://sebastianhanisch-graph-transformer-demo.streamlit.app/",
  "https://sebastianhanisch-fernverkehr-demo.streamlit.app/",
  "https://sebastianhanisch-nahverkehr-demo.streamlit.app/",
  "https://sebastianhanisch-kruskal-demo.streamlit.app/",
  "https://sebastianhanisch-prim-demo.streamlit.app/",
  "https://sebastianhanisch-boruvka-demo.streamlit.app/",
  "https://sebastianhanisch-euclidean-mst-demo.streamlit.app/",
  "https://sebastianhanisch-arborescence-demo.streamlit.app/",
  "https://sebastianhanisch-constrained-mst-demo.streamlit.app/",
  "https://sebastianhanisch-cmst-demo.streamlit.app/",
  "https://sebastianhanisch-steiner-tree-demo.streamlit.app/",
  "https://sebastianhanisch-pcst-demo.streamlit.app/",
  "https://sebastianhanisch-mst-sensitivity-demo.streamlit.app/",
  "https://sebastianhanisch-random-spanning-tree-demo.streamlit.app/",
  "https://sebastianhanisch-edmonds-karp-demo.streamlit.app/",
  "https://sebastianhanisch-dinic-demo.streamlit.app/",
  "https://sebastianhanisch-push-relabel-demo.streamlit.app/",
  "https://sebastianhanisch-ssp-demo.streamlit.app/",
  "https://sebastianhanisch-cycle-canceling-demo.streamlit.app/",
  "https://sebastianhanisch-cost-scaling-demo.streamlit.app/",
  "https://sebastianhanisch-multicommodity-demo.streamlit.app/",
  "https://sebastianhanisch-mcf-column-generation-demo.streamlit.app/",
  "https://sebastianhanisch-garg-koenemann-demo.streamlit.app/",
  "https://sebastianhanisch-fixkosten-netzdesign-demo.streamlit.app/",
  "https://sebastianhanisch-benders-demo.streamlit.app/",
  "https://sebastianhanisch-slope-scaling-demo.streamlit.app/",
  "https://sebastianhanisch-netzwerksimplex-demo.streamlit.app/",
  "https://sebastianhanisch-projektauswahl-demo.streamlit.app/",
  "https://sebastianhanisch-graph-cuts-demo.streamlit.app/",
  "https://sebastianhanisch-gomory-hu-demo.streamlit.app/",
  "https://sebastianhanisch-frank-wolfe-demo.streamlit.app/",
  "https://sebastianhanisch-gradient-projection-demo.streamlit.app/",
  "https://sebastianhanisch-zeitfluss-demo.streamlit.app/",
  "https://sebastianhanisch-naive-forecast-demo.streamlit.app/",
  "https://sebastianhanisch-exponential-smoothing-demo.streamlit.app/",
  "https://sebastianhanisch-arima-demo.streamlit.app/",
  "https://sebastianhanisch-dynamic-regression-demo.streamlit.app/",
  "https://sebastianhanisch-croston-demo.streamlit.app/",
  "https://sebastianhanisch-boosting-forecast-demo.streamlit.app/",
  "https://sebastianhanisch-forecast-interval-demo.streamlit.app/",
  "https://sebastianhanisch-hierarchy-forecast-demo.streamlit.app/",
  "https://sebastianhanisch-forecast-combination-demo.streamlit.app/",
  "https://sebastianhanisch-forecast-inventory-demo.streamlit.app/",
  "https://sebastianhanisch-pretrained-net-demo.streamlit.app/",
  "https://sebastianhanisch-inventory-routing-demo.streamlit.app/",
  "https://sebastianhanisch-bullwhip-demo.streamlit.app/",
  "https://sebastianhanisch-tableau-simplex-demo.streamlit.app/",
  "https://sebastianhanisch-pivotregeln-demo.streamlit.app/",
  "https://sebastianhanisch-klee-minty-demo.streamlit.app/",
  "https://sebastianhanisch-revised-simplex-demo.streamlit.app/",
  "https://sebastianhanisch-praesolve-demo.streamlit.app/",
  "https://sebastianhanisch-lp-dualitaet-demo.streamlit.app/",
  "https://sebastianhanisch-dualer-simplex-demo.streamlit.app/",
  "https://sebastianhanisch-ellipsoid-demo.streamlit.app/",
  "https://sebastianhanisch-innere-punkte-demo.streamlit.app/",
  "https://sebastianhanisch-pdlp-demo.streamlit.app/",
  "https://sebastianhanisch-basis-recovery-demo.streamlit.app/",
  "https://sebastianhanisch-standortplanung-demo.streamlit.app/",
  "https://sebastianhanisch-kapazitierte-standortplanung-demo.streamlit.app/",
  "https://sebastianhanisch-p-center-demo.streamlit.app/",
  "https://sebastianhanisch-standort-bestand-demo.streamlit.app/",
  "https://sebastianhanisch-wettbewerbsstandort-demo.streamlit.app/",
  "https://sebastianhanisch-drehscheiben-demo.streamlit.app/",
  "https://sebastianhanisch-perceptron-demo.streamlit.app/",
  "https://sebastianhanisch-mlp-backprop-demo.streamlit.app/",
  "https://sebastianhanisch-cnn-demo.streamlit.app/",
  "https://sebastianhanisch-rnn-demo.streamlit.app/",
  "https://sebastianhanisch-lstm-demo.streamlit.app/",
  "https://sebastianhanisch-attention-transformer-demo.streamlit.app/",
  "https://sebastianhanisch-uld-gewicht-demo.streamlit.app/",
  "https://sebastianhanisch-uld-beladeplan-demo.streamlit.app/",
  "https://sebastianhanisch-uld-gefahrgut-demo.streamlit.app/",
  "https://sebastianhanisch-uld-buchungsannahme-demo.streamlit.app/",
  "https://sebastianhanisch-bandit-demo.streamlit.app/",
  "https://sebastianhanisch-value-iteration-demo.streamlit.app/",
  "https://sebastianhanisch-q-learning-demo.streamlit.app/",
  "https://sebastianhanisch-sarsa-demo.streamlit.app/",
  "https://sebastianhanisch-dyna-q-demo.streamlit.app/",
  "https://sebastianhanisch-dqn-demo.streamlit.app/",
  "https://sebastianhanisch-policy-gradient-demo.streamlit.app/",
  "https://sebastianhanisch-actor-critic-demo.streamlit.app/",
  "https://sebastianhanisch-bfs-dfs-demo.streamlit.app/",
  "https://sebastianhanisch-bridges-demo.streamlit.app/",
  "https://sebastianhanisch-scc-demo.streamlit.app/",
  "https://sebastianhanisch-euler-tour-demo.streamlit.app/",
  "https://sebastianhanisch-graph-coloring-demo.streamlit.app/",
  "https://sebastianhanisch-centrality-demo.streamlit.app/",
  "https://sebastianhanisch-strukturkennzahlen-demo.streamlit.app/",
  "https://sebastianhanisch-robustheit-demo.streamlit.app/",
  "https://sebastianhanisch-kaskaden-demo.streamlit.app/",
  "https://sebastianhanisch-haertung-demo.streamlit.app/",
  "https://sebastianhanisch-bandbreite-demo.streamlit.app/",
  "https://sebastianhanisch-cliquenbandbreite-demo.streamlit.app/",
  "https://sebastianhanisch-gradient-descent-demo.streamlit.app/",
  "https://sebastianhanisch-newton-verfahren-demo.streamlit.app/",
  "https://sebastianhanisch-quasi-newton-demo.streamlit.app/",
  "https://sebastianhanisch-lagrange-kkt-demo.streamlit.app/",
  "https://sebastianhanisch-straf-barriere-demo.streamlit.app/",
  "https://sebastianhanisch-sqp-demo.streamlit.app/",
  "https://sebastianhanisch-interior-point-nlp-demo.streamlit.app/",
  "https://sebastianhanisch-stochastische-gradientenverfahren-demo.streamlit.app/",
  "https://sebastianhanisch-guided-local-search-demo.streamlit.app/",
  "https://sebastianhanisch-round-robin-demo.streamlit.app/",
  "https://sebastianhanisch-bracket-seeding-demo.streamlit.app/",
  "https://sebastianhanisch-schweizer-system-demo.streamlit.app/",
  "https://sebastianhanisch-dc-standort-demo.streamlit.app/",
  "https://sebastianhanisch-netzdesign-unsicherheit-demo.streamlit.app/",
  "https://sebastianhanisch-intermodal-netzdesign-demo.streamlit.app/",
  "https://sebastianhanisch-spt-scheduling-demo.streamlit.app/",
  "https://sebastianhanisch-edd-scheduling-demo.streamlit.app/",
  "https://sebastianhanisch-moore-hodgson-demo.streamlit.app/",
  "https://sebastianhanisch-wspt-demo.streamlit.app/",
  "https://sebastianhanisch-weighted-tardiness-demo.streamlit.app/",
  "https://sebastianhanisch-johnson-rule-demo.streamlit.app/",
  "https://sebastianhanisch-lpt-scheduling-demo.streamlit.app/",
  "https://sebastianhanisch-job-shop-demo.streamlit.app/",
  "https://sebastianhanisch-shifting-bottleneck-demo.streamlit.app/",
  "https://sebastianhanisch-job-shop-tabu-demo.streamlit.app/",
  "https://sebastianhanisch-rcpsp-demo.streamlit.app/",
  "https://sebastianhanisch-minimax-demo.streamlit.app/",
  "https://sebastianhanisch-alpha-beta-demo.streamlit.app/",
  "https://sebastianhanisch-transposition-table-demo.streamlit.app/",
  "https://sebastianhanisch-evaluation-function-demo.streamlit.app/",
  "https://sebastianhanisch-endgame-tablebase-demo.streamlit.app/",
  "https://sebastianhanisch-selfplay-evaluation-demo.streamlit.app/",
  "https://sebastianhanisch-double-round-robin-demo.streamlit.app/",
  "https://sebastianhanisch-traveling-tournament-demo.streamlit.app/",
  "https://sebastianhanisch-group-knockout-demo.streamlit.app/",
  "https://sebastianhanisch-double-elimination-demo.streamlit.app/",
  "https://sebastianhanisch-ladestrategie-demo.streamlit.app/",
  "https://sebastianhanisch-interne-verlinkung-demo.streamlit.app/",
  "https://sebastianhanisch-taktfahrplan-demo.streamlit.app/",
  "https://sebastianhanisch-crew-pairing-demo.streamlit.app/",
  "https://sebastianhanisch-streckenkonflikt-demo.streamlit.app/",
  "https://sebastianhanisch-ablaufberg-demo.streamlit.app/",
  "https://sebastianhanisch-fahrzeitreserve-demo.streamlit.app/",
  "https://sebastianhanisch-mm1-queue-demo.streamlit.app/",
  "https://sebastianhanisch-output-analysis-demo.streamlit.app/",
  "https://sebastianhanisch-markov-queue-demo.streamlit.app/",
  "https://sebastianhanisch-mmc-queue-demo.streamlit.app/",
  "https://sebastianhanisch-erlang-a-demo.streamlit.app/",
  "https://sebastianhanisch-square-root-staffing-demo.streamlit.app/",
  "https://sebastianhanisch-time-varying-arrivals-demo.streamlit.app/",
  "https://sebastianhanisch-power-of-d-demo.streamlit.app/",
  "https://sebastianhanisch-erlang-b-demo.streamlit.app/",
  "https://sebastianhanisch-splitting-demo.streamlit.app/",
  "https://sebastianhanisch-mg1-kingman-demo.streamlit.app/",
  "https://sebastianhanisch-priority-queue-demo.streamlit.app/",
  "https://sebastianhanisch-jackson-network-demo.streamlit.app/",
  "https://sebastianhanisch-surrogate-queue-demo.streamlit.app/",
  "https://sebastianhanisch-energiefahrweise-demo.streamlit.app/",
  "https://sebastianhanisch-reisetempo-demo.streamlit.app/",
  "https://sebastianhanisch-deception-maze-demo.streamlit.app/",
  "https://sebastianhanisch-novelty-search-demo.streamlit.app/",
  "https://sebastianhanisch-behavior-space-demo.streamlit.app/",
  "https://sebastianhanisch-novelty-objective-demo.streamlit.app/",
  "https://sebastianhanisch-map-elites-demo.streamlit.app/",
  "https://sebastianhanisch-cma-me-demo.streamlit.app/",
  "https://sebastianhanisch-cvt-map-elites-demo.streamlit.app/",
  "https://sebastianhanisch-aurora-demo.streamlit.app/",
  "https://sebastianhanisch-go-explore-demo.streamlit.app/",
  "https://sebastianhanisch-novelty-limits-demo.streamlit.app/",
  "https://sebastianhanisch-qd-routing-demo.streamlit.app/",
  "https://sebastianhanisch-poet-demo.streamlit.app/",
  "https://sebastianhanisch-kalman-filter-demo.streamlit.app/",
  "https://sebastianhanisch-rts-smoother-demo.streamlit.app/",
  "https://sebastianhanisch-ekf-demo.streamlit.app/",
  "https://sebastianhanisch-robust-filter-demo.streamlit.app/",
  "https://sebastianhanisch-hmm-decode-demo.streamlit.app/",
  "https://sebastianhanisch-particle-filter-demo.streamlit.app/",
  "https://sebastianhanisch-multi-target-demo.streamlit.app/",
  "https://sebastianhanisch-imm-demo.streamlit.app/",
  "https://sebastianhanisch-baum-welch-demo.streamlit.app/",
  "https://sebastianhanisch-ab-test-demo.streamlit.app/",
  "https://sebastianhanisch-test-power-demo.streamlit.app/",
  "https://sebastianhanisch-sample-ratio-demo.streamlit.app/",
  "https://sebastianhanisch-sequential-test-demo.streamlit.app/",
  "https://sebastianhanisch-multiple-testing-demo.streamlit.app/",
  "https://sebastianhanisch-cuped-demo.streamlit.app/",
  "https://sebastianhanisch-permutation-test-demo.streamlit.app/",
  "https://sebastianhanisch-ratio-metric-demo.streamlit.app/",
  "https://sebastianhanisch-bandit-vs-ab-demo.streamlit.app/",
  "https://sebastianhanisch-switchback-demo.streamlit.app/",
  "https://sebastianhanisch-synthetic-control-demo.streamlit.app/",
  "https://sebastianhanisch-off-policy-demo.streamlit.app/",
  "https://sebastianhanisch-tit-for-tat-demo.streamlit.app/",
  "https://sebastianhanisch-axelrod-turnier-demo.streamlit.app/",
  "https://sebastianhanisch-rauschen-kooperation-demo.streamlit.app/",
  "https://sebastianhanisch-replikator-demo.streamlit.app/",
  "https://sebastianhanisch-folk-theorem-demo.streamlit.app/",
  "https://sebastianhanisch-endliche-horizonte-demo.streamlit.app/",
  "https://sebastianhanisch-green-porter-demo.streamlit.app/",
  "https://sebastianhanisch-indirekte-reziprozitaet-demo.streamlit.app/",
  "https://sebastianhanisch-zero-determinant-demo.streamlit.app/",
  "https://sebastianhanisch-netzwerk-kooperation-demo.streamlit.app/",
  "https://sebastianhanisch-algorithmische-kollusion-demo.streamlit.app/",
  "https://sebastianhanisch-newsvendor-evpi-demo.streamlit.app/",
  "https://sebastianhanisch-saa-demo.streamlit.app/",
  "https://sebastianhanisch-cvar-demo.streamlit.app/",
  "https://sebastianhanisch-robust-opt-demo.streamlit.app/",
  "https://sebastianhanisch-scenario-approach-demo.streamlit.app/",
  "https://sebastianhanisch-rolling-horizon-demo.streamlit.app/",
  "https://sebastianhanisch-bayes-opt-demo.streamlit.app/",
  "https://sebastianhanisch-bo-modell-demo.streamlit.app/",
  "https://sebastianhanisch-noisy-bo-demo.streamlit.app/",
  "https://sebastianhanisch-constrained-bo-demo.streamlit.app/",
  "https://sebastianhanisch-high-dim-bo-demo.streamlit.app/",
  "https://sebastianhanisch-batch-bo-demo.streamlit.app/",
  "https://sebastianhanisch-multi-fidelity-demo.streamlit.app/",
  "https://sebastianhanisch-servicegrad-tag-demo.streamlit.app/",
  "https://sebastianhanisch-kreuzschulung-demo.streamlit.app/",
  "https://sebastianhanisch-patiententransport-demo.streamlit.app/",
  "https://sebastianhanisch-pareto-dominanz-demo.streamlit.app/",
  "https://sebastianhanisch-gewichtete-summe-demo.streamlit.app/",
  "https://sebastianhanisch-gewichte-erheben-demo.streamlit.app/",
  "https://sebastianhanisch-ahp-demo.streamlit.app/",
  "https://sebastianhanisch-topsis-demo.streamlit.app/",
  "https://sebastianhanisch-electre-demo.streamlit.app/",
  "https://sebastianhanisch-promethee-demo.streamlit.app/",
  "https://sebastianhanisch-kriterien-wechselwirkung-demo.streamlit.app/",
  "https://sebastianhanisch-rangumkehr-demo.streamlit.app/",
  "https://sebastianhanisch-zuordnung-profile-demo.streamlit.app/",
  "https://sebastianhanisch-smaa-demo.streamlit.app/",
  "https://sebastianhanisch-ordinale-regression-demo.streamlit.app/",
  "https://sebastianhanisch-dea-demo.streamlit.app/",
  "https://sebastianhanisch-gruppen-entscheidung-demo.streamlit.app/",
  "https://sebastianhanisch-mcda-vergleich-demo.streamlit.app/",
  "https://sebastianhanisch-siegtabelle-demo.streamlit.app/",
  "https://sebastianhanisch-rangdistanz-demo.streamlit.app/",
  "https://sebastianhanisch-rangaggregation-demo.streamlit.app/",
  "https://sebastianhanisch-massey-colley-demo.streamlit.app/",
  "https://sebastianhanisch-bradley-terry-demo.streamlit.app/",
  "https://sebastianhanisch-tore-remis-demo.streamlit.app/",
  "https://sebastianhanisch-elo-demo.streamlit.app/",
  "https://sebastianhanisch-elo-inflation-demo.streamlit.app/",
  "https://sebastianhanisch-glicko-trueskill-demo.streamlit.app/",
  "https://sebastianhanisch-whr-demo.streamlit.app/",
  "https://sebastianhanisch-team-einzel-demo.streamlit.app/",
  "https://sebastianhanisch-nicht-transitiv-demo.streamlit.app/",
  "https://sebastianhanisch-aktives-ranking-demo.streamlit.app/",
  "https://sebastianhanisch-rangintervalle-demo.streamlit.app/",
  "https://sebastianhanisch-learning-to-rank-demo.streamlit.app/",
  "https://sebastianhanisch-bewerter-demo.streamlit.app/",
  "https://sebastianhanisch-rating-vergleich-demo.streamlit.app/",
  "https://sebastianhanisch-tiebreak-demo.streamlit.app/",
  "https://sebastianhanisch-pflanzzyklus-demo.streamlit.app/",
  "https://sebastianhanisch-konfundierung-demo.streamlit.app/",
  "https://sebastianhanisch-d-separation-demo.streamlit.app/",
  "https://sebastianhanisch-backdoor-demo.streamlit.app/",
  "https://sebastianhanisch-schlechte-kontrollen-demo.streamlit.app/",
  "https://sebastianhanisch-adjustierungsmenge-demo.streamlit.app/",
  "https://sebastianhanisch-schaetzen-demo.streamlit.app/",
  "https://sebastianhanisch-doppelt-robust-demo.streamlit.app/",
  "https://sebastianhanisch-frontdoor-demo.streamlit.app/",
  "https://sebastianhanisch-instrumente-demo.streamlit.app/",
  "https://sebastianhanisch-identifizierbarkeit-demo.streamlit.app/",
  "https://sebastianhanisch-sensitivitaet-demo.streamlit.app/",
  "https://sebastianhanisch-uebertragbarkeit-demo.streamlit.app/",
  "https://sebastianhanisch-strukturlernen-demo.streamlit.app/",
  "https://sebastianhanisch-notears-demo.streamlit.app/",
  "https://sebastianhanisch-lingam-icp-demo.streamlit.app/",
  "https://sebastianhanisch-diagrammfehler-demo.streamlit.app/",
  "https://sebastianhanisch-kausal-vergleich-demo.streamlit.app/",
  "https://sebastianhanisch-schlecht-gestellt-demo.streamlit.app/",
  "https://sebastianhanisch-tikhonov-demo.streamlit.app/",
  "https://sebastianhanisch-tsvd-demo.streamlit.app/",
  "https://sebastianhanisch-parameterwahl-demo.streamlit.app/",
  "https://sebastianhanisch-iterativ-demo.streamlit.app/",
  "https://sebastianhanisch-sparsity-tv-demo.streamlit.app/",
  "https://sebastianhanisch-bayes-map-demo.streamlit.app/",
  "https://sebastianhanisch-posterior-sampling-demo.streamlit.app/",
  "https://sebastianhanisch-nichtlinear-inverse-demo.streamlit.app/",
  "https://sebastianhanisch-ensemble-kalman-inversion-demo.streamlit.app/",
  "https://sebastianhanisch-aufloesung-messplan-demo.streamlit.app/",
  "https://sebastianhanisch-blinde-entfaltung-demo.streamlit.app/",
  "https://sebastianhanisch-plug-and-play-demo.streamlit.app/",
  "https://sebastianhanisch-entrollte-netze-demo.streamlit.app/",
  "https://sebastianhanisch-diffusions-prior-demo.streamlit.app/",
  "https://sebastianhanisch-verfahrensvergleich-demo.streamlit.app/",
  "https://sebastianhanisch-periodogramm-demo.streamlit.app/",
  "https://sebastianhanisch-fenster-linienlage-demo.streamlit.app/",
  "https://sebastianhanisch-bartlett-welch-demo.streamlit.app/",
  "https://sebastianhanisch-multitaper-demo.streamlit.app/",
  "https://sebastianhanisch-ar-spektrum-demo.streamlit.app/",
  "https://sebastianhanisch-unterraum-demo.streamlit.app/",
  "https://sebastianhanisch-lomb-scargle-demo.streamlit.app/",
  "https://sebastianhanisch-peak-oder-rauschen-demo.streamlit.app/",
  "https://sebastianhanisch-momentanfrequenz-demo.streamlit.app/",
  "https://sebastianhanisch-spektrogramm-demo.streamlit.app/",
  "https://sebastianhanisch-wavelet-skalogramm-demo.streamlit.app/",
  "https://sebastianhanisch-diskrete-wavelets-demo.streamlit.app/",
  "https://sebastianhanisch-wavelet-schrumpfung-demo.streamlit.app/",
  "https://sebastianhanisch-reassignment-demo.streamlit.app/",
  "https://sebastianhanisch-kohaerenz-demo.streamlit.app/",
  "https://sebastianhanisch-spektral-vergleich-demo.streamlit.app/",
  "https://sebastianhanisch-sitzplatz-demo.streamlit.app/",
  "https://sebastianhanisch-rufbus-demo.streamlit.app/",
  "https://sebastianhanisch-tarif-demo.streamlit.app/",
  "https://sebastianhanisch-bunching-demo.streamlit.app/",
  "https://sebastianhanisch-bron-kerbosch-demo.streamlit.app/",
  "https://sebastianhanisch-max-clique-demo.streamlit.app/",
  "https://sebastianhanisch-vertex-cover-demo.streamlit.app/",
  "https://sebastianhanisch-chordal-graphs-demo.streamlit.app/",
  "https://sebastianhanisch-treewidth-demo.streamlit.app/",
  "https://sebastianhanisch-tree-decomposition-dp-demo.streamlit.app/",
  "https://sebastianhanisch-edge-clique-cover-demo.streamlit.app/",
  "https://sebastianhanisch-mis-local-search-demo.streamlit.app/",
  "https://sebastianhanisch-di-kreis-demo.streamlit.app/",
  "https://sebastianhanisch-alle-kreise-demo.streamlit.app/",
  "https://sebastianhanisch-kreise-aufloesen-demo.streamlit.app/",
  "https://sebastianhanisch-kritischer-pfad-demo.streamlit.app/",
  "https://sebastianhanisch-wege-und-huelle-demo.streamlit.app/",
  "https://sebastianhanisch-ketten-antiketten-demo.streamlit.app/",
  "https://sebastianhanisch-zulaessige-reihenfolgen-demo.streamlit.app/",
  "https://sebastianhanisch-wachsende-abhaengigkeiten-demo.streamlit.app/",
  "https://sebastianhanisch-erreichbarkeitsindex-demo.streamlit.app/",
  "https://sebastianhanisch-planaritaet-demo.streamlit.app/",
  "https://sebastianhanisch-planar-faerbung-demo.streamlit.app/",
  "https://sebastianhanisch-planar-separator-demo.streamlit.app/",
  "https://sebastianhanisch-graph-zeichnen-demo.streamlit.app/",
  "https://sebastianhanisch-sugiyama-demo.streamlit.app/",
  "https://sebastianhanisch-planar-dual-demo.streamlit.app/",
  "https://sebastianhanisch-baker-schichten-demo.streamlit.app/",
  "https://sebastianhanisch-kasteleyn-demo.streamlit.app/",
  "https://sebastianhanisch-planarisierung-demo.streamlit.app/",
  "https://sebastianhanisch-k-core-demo.streamlit.app/",
  "https://sebastianhanisch-stochastic-block-demo.streamlit.app/",
  "https://sebastianhanisch-strukturelle-loecher-demo.streamlit.app/",
  "https://sebastianhanisch-link-prediction-demo.streamlit.app/",
  "https://sebastianhanisch-einflussmaximierung-demo.streamlit.app/",
  "https://sebastianhanisch-komplexe-ansteckung-demo.streamlit.app/",
  "https://sebastianhanisch-eindaemmung-demo.streamlit.app/",
  "https://sebastianhanisch-quellensuche-demo.streamlit.app/",
  "https://sebastianhanisch-meinungsbildung-demo.streamlit.app/",
  "https://sebastianhanisch-voter-modell-demo.streamlit.app/",
  "https://sebastianhanisch-begrenztes-vertrauen-demo.streamlit.app/",
  "https://sebastianhanisch-schelling-demo.streamlit.app/",
  "https://sebastianhanisch-zeitliche-netze-demo.streamlit.app/",
  "https://sebastianhanisch-jira-fortschritt-demo.streamlit.app/",
  "https://sebastianhanisch-menger-demo.streamlit.app/",
  "https://sebastianhanisch-globaler-schnitt-demo.streamlit.app/",
  "https://sebastianhanisch-multiway-cut-demo.streamlit.app/",
  "https://sebastianhanisch-zusammenhang-verstaerken-demo.streamlit.app/",
  "https://sebastianhanisch-bisektion-demo.streamlit.app/",
  "https://sebastianhanisch-multilevel-partitionierung-demo.streamlit.app/",
  "https://sebastianhanisch-spektrale-schnitte-demo.streamlit.app/",
  "https://sebastianhanisch-gebietsaufteilung-demo.streamlit.app/",
  "https://sebastianhanisch-zuordnung-vs-rundreise-demo.streamlit.app/",
  "https://sebastianhanisch-reduktionskette-demo.streamlit.app/",
  "https://sebastianhanisch-sat-phasenuebergang-demo.streamlit.app/",
  "https://sebastianhanisch-fptas-rucksack-demo.streamlit.app/",
  "https://sebastianhanisch-approximation-grenzen-demo.streamlit.app/",
  "https://sebastianhanisch-parametrisiert-demo.streamlit.app/",
  "https://sebastianhanisch-zufallsverfahren-demo.streamlit.app/",
  "https://sebastianhanisch-permanente-demo.streamlit.app/",
  "https://sebastianhanisch-qbf-spiel-demo.streamlit.app/",
  "https://sebastianhanisch-lokale-optima-demo.streamlit.app/",
  "https://sebastianhanisch-zufallsgraph-demo.streamlit.app/",
  "https://sebastianhanisch-konfigurationsmodell-demo.streamlit.app/",
  "https://sebastianhanisch-wachstumsmodelle-demo.streamlit.app/",
  "https://sebastianhanisch-potenzgesetz-test-demo.streamlit.app/",
  "https://sebastianhanisch-navigierbarkeit-demo.streamlit.app/",
  "https://sebastianhanisch-raeumliche-netze-demo.streamlit.app/",
  "https://sebastianhanisch-netzmotive-demo.streamlit.app/",
  "https://sebastianhanisch-abhaengige-netze-demo.streamlit.app/",
  "https://sebastianhanisch-modellwahl-netze-demo.streamlit.app/",
  "https://sebastianhanisch-mittelwert-median-demo.streamlit.app/",
  "https://sebastianhanisch-lp-mitte-demo.streamlit.app/",
  "https://sebastianhanisch-robuste-lage-demo.streamlit.app/",
  "https://sebastianhanisch-weiszfeld-demo.streamlit.app/",
  "https://sebastianhanisch-median-of-means-demo.streamlit.app/",
  "https://sebastianhanisch-raten-gewichte-demo.streamlit.app/",
  "https://sebastianhanisch-mitte-im-raum-demo.streamlit.app/",
  "https://sebastianhanisch-pearson-demo.streamlit.app/",
  "https://sebastianhanisch-rangkorrelation-demo.streamlit.app/",
  "https://sebastianhanisch-abhaengigkeitsmasse-demo.streamlit.app/",
  "https://sebastianhanisch-randabhaengigkeit-demo.streamlit.app/",
  "https://sebastianhanisch-scheinkorrelation-demo.streamlit.app/",
  "https://sebastianhanisch-kointegration-demo.streamlit.app/",
  "https://sebastianhanisch-aggregationsebene-demo.streamlit.app/",
  "https://sebastianhanisch-korrelationsmatrix-demo.streamlit.app/",
  "https://sebastianhanisch-korrelationsnetz-demo.streamlit.app/",
  "https://sebastianhanisch-korrelierte-merkmale-demo.streamlit.app/",
  "https://sebastianhanisch-uebereinstimmung-demo.streamlit.app/",
  "https://sebastianhanisch-wahlregeln-demo.streamlit.app/",
  "https://sebastianhanisch-wahlaxiome-demo.streamlit.app/",
  "https://sebastianhanisch-taktisch-waehlen-demo.streamlit.app/",
  "https://sebastianhanisch-arrow-satz-demo.streamlit.app/",
  "https://sebastianhanisch-mehrheitsurteil-demo.streamlit.app/",
  "https://sebastianhanisch-liquid-democracy-demo.streamlit.app/",
  "https://sebastianhanisch-quadratisches-waehlen-demo.streamlit.app/",
  "https://sebastianhanisch-sitzverteilung-demo.streamlit.app/",
  "https://sebastianhanisch-gemeinsames-budget-demo.streamlit.app/",
  "https://sebastianhanisch-komitee-wahl-demo.streamlit.app/",
  "https://sebastianhanisch-zufallsgremium-demo.streamlit.app/",
  "https://sebastianhanisch-unteilbare-gueter-demo.streamlit.app/",
  "https://sebastianhanisch-mietaufteilung-demo.streamlit.app/",
  "https://sebastianhanisch-kuchenteilung-demo.streamlit.app/",
  "https://sebastianhanisch-bruecken-ranking-demo.streamlit.app/",
  "https://sebastianhanisch-koordinationsspiel-demo.streamlit.app/",
  "https://sebastianhanisch-gleichgewichtsauswahl-demo.streamlit.app/",
  "https://sebastianhanisch-konventionswechsel-demo.streamlit.app/",
  "https://sebastianhanisch-globale-spiele-demo.streamlit.app/",
  "https://sebastianhanisch-schwaechstes-glied-demo.streamlit.app/",
  "https://sebastianhanisch-fokalpunkt-demo.streamlit.app/",
  "https://sebastianhanisch-vorabsignale-demo.streamlit.app/",
  "https://sebastianhanisch-informationskaskaden-demo.streamlit.app/",
  "https://sebastianhanisch-ski-rental-demo.streamlit.app/",
  "https://sebastianhanisch-paging-demo.streamlit.app/",
  "https://sebastianhanisch-online-packen-demo.streamlit.app/",
  "https://sebastianhanisch-online-allokation-demo.streamlit.app/",
  "https://sebastianhanisch-sekretaerproblem-demo.streamlit.app/",
  "https://sebastianhanisch-k-server-demo.streamlit.app/",
  "https://sebastianhanisch-vorhersagen-demo.streamlit.app/",
  "https://sebastianhanisch-netzwerkspiel-demo.streamlit.app/",
  "https://sebastianhanisch-oeffentliche-gueter-netz-demo.streamlit.app/",
  "https://sebastianhanisch-zahlungsketten-demo.streamlit.app/",
  "https://sebastianhanisch-netzbildung-demo.streamlit.app/",
  "https://sebastianhanisch-nullsummenspiel-demo.streamlit.app/",
  "https://sebastianhanisch-kontrollspiel-demo.streamlit.app/",
  "https://sebastianhanisch-verdeckte-information-demo.streamlit.app/",
  "https://sebastianhanisch-verhandlung-demo.streamlit.app/",
  "https://sebastianhanisch-geheimnis-verhandlung-demo.streamlit.app/",
  "https://sebastianhanisch-kuchen-vergroessern-demo.streamlit.app/",
  "https://sebastianhanisch-einzelgut-auktion-demo.streamlit.app/",
  "https://sebastianhanisch-vertragsdesign-demo.streamlit.app/",
  "https://sebastianhanisch-verhandlungsagenten-demo.streamlit.app/",
  "https://sebastianhanisch-austauschnetz-demo.streamlit.app/",
  "https://sebastianhanisch-dwz-demo.streamlit.app/",
  "https://sebastianhanisch-aufzaehlen-rekursion-demo.streamlit.app/",
  "https://sebastianhanisch-rationale-ef-demo.streamlit.app/",
  "https://sebastianhanisch-symbolische-methode-demo.streamlit.app/",
  "https://sebastianhanisch-semiring-rekursion-demo.streamlit.app/",
  "https://sebastianhanisch-multimengen-partitionen-demo.streamlit.app/",
  "https://sebastianhanisch-beschriftete-strukturen-demo.streamlit.app/",
  "https://sebastianhanisch-siebformel-demo.streamlit.app/",
  "https://sebastianhanisch-zaehlen-nach-parameter-demo.streamlit.app/",
  "https://sebastianhanisch-asymptotik-demo.streamlit.app/",
  "https://sebastianhanisch-gleichverteilt-ziehen-demo.streamlit.app/",
  "https://sebastianhanisch-burnside-polya-demo.streamlit.app/",
  "https://sebastianhanisch-isomorphieausschluss-demo.streamlit.app/",
  "https://sebastianhanisch-frontier-diagramm-demo.streamlit.app/",
  "https://sebastianhanisch-tutte-polynom-demo.streamlit.app/",
  "https://sebastianhanisch-knuth-schaetzer-demo.streamlit.app/",
  "https://sebastianhanisch-zaehlverfahren-demo.streamlit.app/",
  "https://sebastianhanisch-fisher-markt-demo.streamlit.app/",
  "https://sebastianhanisch-positionsauktion-demo.streamlit.app/",
  "https://sebastianhanisch-pacing-gleichgewicht-demo.streamlit.app/",
  "https://sebastianhanisch-doppelauktion-demo.streamlit.app/",
  "https://sebastianhanisch-prognosemarkt-demo.streamlit.app/",
  "https://sebastianhanisch-lvr-pool-demo.streamlit.app/",
  "https://sebastianhanisch-konvexitaet-zertifikat-demo.streamlit.app/",
  "https://sebastianhanisch-kegelform-demo.streamlit.app/",
  "https://sebastianhanisch-kruemmungsregeln-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-dualitaet-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-barriere-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-primal-dual-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-exponential-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-projektion-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-admm-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-kreuzung-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-worstcase-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-maxcut-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-niedrigrang-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-robust-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-ableitung-demo.streamlit.app/",
  "https://sebastianhanisch-kegel-verfahrenswahl-demo.streamlit.app/",
  "https://sebastianhanisch-leiterplatte-demo.streamlit.app/",
  "https://sebastianhanisch-greedy-austausch-demo.streamlit.app/",
  "https://sebastianhanisch-unabhaengigkeitssystem-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-demo.streamlit.app/",
  "https://sebastianhanisch-rang-basen-kreise-demo.streamlit.app/",
  "https://sebastianhanisch-greedy-optimalitaet-demo.streamlit.app/",
  "https://sebastianhanisch-dualmatroid-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-schnitt-demo.streamlit.app/",
  "https://sebastianhanisch-gewichteter-schnitt-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-vereinigung-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-polytop-demo.streamlit.app/",
  "https://sebastianhanisch-submodularitaet-demo.streamlit.app/",
  "https://sebastianhanisch-ueber-greedy-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-sekretaer-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-bandit-demo.streamlit.app/",
  "https://sebastianhanisch-submodulare-minimierung-demo.streamlit.app/",
  "https://sebastianhanisch-tutte-matroid-demo.streamlit.app/",
  "https://sebastianhanisch-matroid-verfahrenswahl-demo.streamlit.app/",
];

// KEEP_ALIVE_ONLY=multicriteria,raptor node .github/scripts/keep-alive.mjs visits just the matching demos (local check).
const only = (process.env.KEEP_ALIVE_ONLY ?? "").split(",").filter(Boolean);
// KEEP_ALIVE_URLS=<url>,<url> visits exactly these full URLs (also demos not yet in DEMO_URLS); used by
// `portfolio_ops deploy-check --browser` right after a push wave. KEEP_ALIVE_ATTEMPTS lowers the retry passes (default 3).
const explicit = (process.env.KEEP_ALIVE_URLS ?? "").split(",").filter(Boolean);
// KEEP_ALIVE_URLS_FROM=<Seite>,<Seite> nimmt statt der Liste oben alle Demo-Adressen, die auf diesen Seiten stehen (im öffentlichen Repo
// demo-watch: suche-index.json der Website, dort stehen alle Demo-Adressen der Website; tools/check_consistency.py prüft das). So muss dort nichts nachgezogen werden.
const from = (process.env.KEEP_ALIVE_URLS_FROM ?? "").split(",").filter(Boolean);
let listed = DEMO_URLS;
if (from.length && !explicit.length) {
  const found = new Set();
  for (const src of from) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`KEEP_ALIVE_URLS_FROM: ${src} antwortet mit HTTP ${res.status}`);
    for (const m of (await res.text()).matchAll(/https:\/\/[a-z0-9-]+\.streamlit\.app\//g)) found.add(m[0]);
  }
  if (found.size < 50) throw new Error(`KEEP_ALIVE_URLS_FROM: nur ${found.size} Adressen gefunden, das ist zu wenig`);
  listed = [...found];
}
const selected = explicit.length ? explicit : only.length ? listed.filter((u) => only.some((o) => u.includes(o))) : listed;
// KEEP_ALIVE_ONLY_ASLEEP=1 besucht nur die Demos, die gerade schlafen (Workflow "Wake sleeping demos", alle 30 Minuten). Der Zustand kommt
// aus dem Health-Endpunkt der Cloud, der nichts aufweckt (gemessen 2026-11-05): 200 mit "ok" = wach, 400 ohne Inhalt = schläft,
// 404 = die Cloud kennt die Adresse nicht. Die Cloud hängt bei etwa jeder siebten Anfrage (Zeitablauf, HTTP 500): solche Antworten werden
// bis zu dreimal wiederholt und gelten danach als unklar, die Demo wird dann vorsichtshalber besucht (ein Besuch einer wachen Demo schadet nicht).
const onlyAsleep = process.env.KEEP_ALIVE_ONLY_ASLEEP === "1";
async function healthState(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${url}~/+/_stcore/health`, { signal: AbortSignal.timeout(15_000) });
      if (res.status === 200) return "wach";
      if (res.status === 400) return "schläft";
      if (res.status === 404) return "unbekannt";
    } catch {
      // Zeitablauf oder Verbindungsfehler: nächster Versuch
    }
  }
  return "unklar";
}
async function filterAsleep(all) {
  const states = new Array(all.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: 12 }, async () => {
      while (next < all.length) {
        const i = next++;
        states[i] = await healthState(all[i]);
      }
    }),
  );
  const count = (k) => states.filter((x) => x === k).length;
  console.log(`Zustand von ${all.length} Demos: ${count("wach")} wach, ${count("schläft")} schlafen, ${count("unklar")} unklar, ${count("unbekannt")} unbekannt (404, nicht besucht).`);
  return all.filter((_, i) => states[i] === "schläft" || states[i] === "unklar");
}
const urls = onlyAsleep ? await filterAsleep(selected) : selected;
if (onlyAsleep && urls.length === 0) {
  console.log("Keine schlafende Demo, nichts zu tun.");
  process.exit(0);
}
// KEEP_ALIVE_JSON=<Datei> schreibt zusätzlich das Ergebnis je Adresse als JSON ([{url, klasse, detail}], klasse = ok | skriptfehler |
// nicht-gefunden | unklar); `portfolio_ops deploy-check --browser` und die Tests lesen es. KEEP_ALIVE_SHELL_TIMEOUT_MS verkürzt nur das
// Warten auf den App-Rahmen (Standard 150 s, ein Kaltstart braucht es); gedacht für lokale Prüfseiten, der Workflow setzt es nicht.
const jsonOut = process.env.KEEP_ALIVE_JSON ?? "";
const SHELL_TIMEOUT_MS = Number.parseInt(process.env.KEEP_ALIVE_SHELL_TIMEOUT_MS ?? "", 10) || 150_000;

// Streamlit Community Cloud's sleep-screen wake button. Verified 2026-09-07
// against a real sleeping app: the sleep screen (and its button) renders in
// the TOP-level document, not inside the streamlitApp iframe - the iframe
// only exists once the app is actually awake. The iframe candidate below is
// kept as a defensive fallback in case that ever changes, matched loosely
// ("Yes, get this app back up!" historically) in case the wording does.
const WAKE_BUTTON_PATTERN = /get this app back up|wake.*app/i;

// Die Schlafseite braucht nach domcontentloaded 3 bis 4 s, bis der Knopf da ist (gemessen 2026-11-04: nach 1 s leer, nach 4 s da), unter
// Last in der CI länger. Ein festes Warten von 4 s verpasste ihn deshalb: der Besuch lief dann 150 s auf einen App-Rahmen, den eine
// schlafende App nie liefert (2026-11-03/04: 448 von 452 Besuchen, kein einziges OK, Läufe über 5 Stunden, schlafende Demos nie geweckt).
// Jetzt wird auf Knopf ODER App-Rahmen gewartet, was zuerst kommt; bleibt beides aus, wird die Seite neu geladen (siehe bringUp).
const SETTLE_MS = Number.parseInt(process.env.KEEP_ALIVE_SETTLE_MS ?? "", 10) || 45_000;
const MAX_RELOADS = 1;

async function appFrameNow(page) {
  const frames = page.frames();
  const ordered = [...frames.filter((f) => f !== page.mainFrame()), page.mainFrame()];
  for (const frame of ordered) {
    try {
      if ((await frame.locator('[data-testid="stAppViewContainer"]').count()) > 0) return frame;
    } catch {
      // Frame ist gerade weg oder lädt neu - nächster Kandidat
    }
  }
  return null;
}

async function wakeButtonNow(page) {
  const candidates = [
    page.getByRole("button", { name: WAKE_BUTTON_PATTERN }).first(),
    page.frameLocator('iframe[title="streamlitApp"]').getByRole("button", { name: WAKE_BUTTON_PATTERN }).first(),
  ];
  for (const btn of candidates) {
    try {
      if (await btn.isVisible()) return btn;
    } catch {
      // Seite lädt gerade neu - beim nächsten Durchlauf erneut
    }
  }
  return null;
}

// Wartet höchstens timeoutMs auf das, was zuerst erscheint: { kind: "app", frame } oder { kind: "asleep", button }; null bei Zeitablauf.
async function waitForWakeOrApp(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  do {
    const frame = await appFrameNow(page);
    if (frame) return { kind: "app", frame };
    const button = await wakeButtonNow(page);
    if (button) return { kind: "asleep", button };
    await page.waitForTimeout(500);
  } while (Date.now() < deadline);
  return null;
}

// Die Status-Schnittstelle der Cloud nennt den Zustand der App (beobachtet 2026-11-04: 12 = schläft, 5 = läuft); nur für die Fehlermeldung.
async function appStatus(url) {
  try {
    const res = await fetch(`${url}api/v2/app/status`, { signal: AbortSignal.timeout(10_000) });
    const m = (await res.text()).match(/"status":(\d+)/);
    return m ? m[1] : `HTTP ${res.status}`;
  } catch {
    return "keine Antwort";
  }
}

// Ergebnis eines Besuchs: { ok: true } oder { ok: false, kind, detail }. kind "skriptfehler" (die App zeigt eine Fehlerbox) und
// "nicht-gefunden" (die Cloud kennt die Adresse nicht) sind endgültig und werden nicht wiederholt; "unklar" (Zeitlimit, Cloud-Hänger)
// kommt in die Wiederholungsdurchgänge, denn ein langsamer Kaltstart sieht genauso aus.
const FINAL_KINDS = new Set(["skriptfehler", "nicht-gefunden"]);

// Bringt die Seite bis zu einem App-Rahmen mit stAppViewContainer: schlafende Apps wecken (Knopf klicken, dann auf den Kaltstart warten,
// höchstens SHELL_TIMEOUT_MS insgesamt), bei Stillstand einmal neu laden. Streamlit rendert die App in einem Unter-Frame
// (iframe title="streamlitApp"); der Rahmen kann später als die Hauptseite auftauchen oder nach einem Reboot ersetzt werden.
// Neu laden hilft auch gegen einen Hänger der Cloud: einzelne Frontend-Dateien (JS-Chunks) antworten dort mitunter erst nach 40 bis
// 60 s mit HTTP 500, der Rahmen bleibt dann leer; beim nächsten Laden kommen dieselben Dateien sofort (gemessen 2026-11-04).
async function bringUp(page, url) {
  const deadline = Date.now() + SHELL_TIMEOUT_MS;
  let clicks = 0;
  let reloads = 0;
  while (Date.now() < deadline) {
    const window = Math.min(clicks > 0 ? 90_000 : SETTLE_MS, deadline - Date.now());
    const seen = await waitForWakeOrApp(page, window);
    if (seen?.kind === "app") return seen.frame;
    if (seen?.kind === "asleep") {
      if (clicks >= 3) break;
      clicks++;
      console.log(`  -> asleep, clicking wake button (${clicks}): ${url}`);
      await seen.button.click();
      console.log(`  -> wake button clicked, waiting for reboot: ${url}`);
      await page.waitForLoadState("load", { timeout: 45_000 }).catch(() => {});
      continue;
    }
    if (reloads >= MAX_RELOADS) break;
    reloads++;
    console.log(`  -> neither wake button nor app frame after ${Math.round(window / 1000)}s, reloading: ${url}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  }
  const state = clicks > 0 ? `nach ${clicks}x Wecken` : "ohne Wecken-Knopf";
  throw new Error(`Timeout: kein App-Rahmen mit stAppViewContainer gefunden (${state}, ${reloads}x neu geladen, Status der App: ${await appStatus(url)})`);
}

// Bis ans Ende scrollen: Fehlerboxen unter einem Expander oder weit unten stehen erst nach dem Rendern, Inhalte folgen lazy.
// Streamlit scrollt je nach Version in stMain, stAppViewContainer oder im Dokument - alle bekannten Kandidaten werden bewegt.
async function scrollToEnd(frame, page) {
  let last = -1;
  for (let i = 0; i < 3; i++) {
    const height = await frame
      .evaluate(() => {
        const targets = [document.scrollingElement, ...document.querySelectorAll('[data-testid="stMain"], [data-testid="stAppViewContainer"], section.main')];
        let max = 0;
        for (const el of targets) {
          if (!el) continue;
          el.scrollTop = el.scrollHeight;
          max = Math.max(max, el.scrollHeight);
        }
        return max;
      })
      .catch(() => last);
    await page.waitForTimeout(500);
    if (height === last) break;
    last = height;
  }
}

// Erste aussagekräftige Zeile eines Fehlertexts („KeyError: 'x'“, nicht die Überschrift „Traceback:“), auf 160 Zeichen gekürzt.
function firstErrorLine(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l && !/^traceback( \(most recent call last\))?:?$/i.test(l));
  const named = lines.slice(0, 8).find((l) => /\b[A-Za-z_]*(Error|Exception)\b/.test(l));
  return (named ?? lines[0] ?? "Fehlerbox ohne Text").slice(0, 160);
}

// Sucht im App-Frame nach Fehlerelementen: stException (jede Python-Ausnahme der App), stAlert mit Fehlerklasse (st.error) nur, wenn der
// Text wie eine Python-Ausnahme aussieht - eine absichtliche Hinweisbox der Demo („Eingabe ungültig“) ist kein Skriptfehler.
async function findScriptError(frame) {
  const found = await frame.evaluate(() => {
    const pythonError = /Traceback|\b[A-Za-z_]*(Error|Exception)\b/;
    const exception = document.querySelector('[data-testid="stException"]');
    if (exception) {
      const message = exception.querySelector('[data-testid="stExceptionMessage"]');
      return { source: "stException", text: ((message ?? exception).innerText || exception.textContent || "").trim() };
    }
    for (const alert of document.querySelectorAll('[data-testid="stAlert"]')) {
      const text = (alert.innerText || alert.textContent || "").trim();
      const isError = alert.querySelector('[data-testid="stAlertContentError"]') !== null || /error|danger/i.test(alert.className);
      if (isError && pythonError.test(text)) return { source: "stAlert", text };
    }
    return null;
  });
  return found ? firstErrorLine(found.text) : null;
}

async function visit(context, url) {
  const page = await context.newPage();
  try {
    // "networkidle" is unreliable for Streamlit: the app holds a persistent
    // WebSocket open, which on some demos never lets the network go idle -
    // domcontentloaded is enough here, the real confirmation is the
    // stAppViewContainer wait below.
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    // Unbekannte Adresse: die Cloud antwortet 404 mit einer Weiterleitung auf errors/not_found - kein Warten auf einen App-Rahmen.
    if (response?.status() === 404 || /errors\/not_found/.test(page.url())) {
      return { ok: false, kind: "nicht-gefunden", detail: "App existiert nicht (HTTP 404 bzw. errors/not_found)" };
    }

    // Weckt eine schlafende App und wartet auf den App-Rahmen; ein Kaltstart (schwere Demos, z. B. OR-Tools/CP-SAT-Importe) kann weit über
    // eine Minute dauern, deshalb ist das Limit großzügig.
    const appFrame = await bringUp(page, url);
    const statusWidget = appFrame.locator('[data-testid="stStatusWidget"]');

    // The app shell renders even when the script itself crashed (ImportError,
    // uncaught exception): Streamlit then shows a red exception box inside
    // the app instead of failing the page load. Wait for the first script run
    // to finish (the "Running" indicator disappears), then look for one. The
    // indicator is also "hidden" before the first run has started, so the short
    // pause after it is what actually lets a crash show up (measured locally:
    // without it the exception box was not there yet when it was counted).
    await statusWidget.waitFor({ state: "hidden", timeout: 60_000 }).catch(() => {});
    await page.waitForTimeout(3_000);
    // Danach ans Ende scrollen (lazy Inhalte, Fehlerbox unter einem Expander) und höchstens ~20 s auf ein erneutes Rechnen warten.
    await scrollToEnd(appFrame, page);
    await statusWidget.waitFor({ state: "hidden", timeout: 20_000 }).catch(() => {});
    const scriptError = await findScriptError(appFrame);
    if (scriptError) return { ok: false, kind: "skriptfehler", detail: scriptError };
    console.log(`OK   ${url}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, kind: "unklar", detail: err.message.split("\n")[0] };
  } finally {
    await page.close();
  }
}

// Runs `worker` over `items` with at most `limit` in flight at once - plain
// sequential processing stopped fitting the job's time budget once the
// portfolio grew past ~30 demos (each sleeping demo can take over a minute
// to wake), so a handful run concurrently instead.
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function runNext() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runNext));
  return results;
}

// First pass at a moderate concurrency, then up to two retry passes run
// fully SEQUENTIALLY (one at a time). The first cut of this fix ran retries
// at concurrency 3 and still saw the same handful of demos fail both times,
// every time - evidence pointing at several simultaneous cold boots
// contending for something on Streamlit Community Cloud's side (shared
// free-tier build/boot capacity for the account, not just CI-runner
// resources), rather than plain slowness: manually waking one of those
// exact demos in isolation took well under 30s. Retrying one-at-a-time
// removes that contention as a variable for whichever demos are already
// struggling.
// KEEP_ALIVE_CONCURRENCY=<n>: gleichzeitige Besuche im ersten Durchgang (Standard 4). Der Weck-Lauf setzt 10: ein Kaltstart dauert
// 30 bis 60 s und besteht fast nur aus Warten auf die Cloud, bei 150 Schlafenden brauchte der Durchgang mit 4 etwa 30 Minuten.
const CONCURRENCY = Math.max(1, Number.parseInt(process.env.KEEP_ALIVE_CONCURRENCY ?? "", 10) || 4);
// KEEP_ALIVE_BUDGET_MIN=<Minuten>: nach dieser Zeit werden keine neuen Demos mehr begonnen und keine Wiederholungsdurchgänge mehr
// gestartet; was dann noch offen ist, steht als Fehler mit Hinweis im Protokoll. So endet ein Lauf mit Ergebnis (und Issue) statt vom
// Zeitlimit des Jobs abgebrochen zu werden (3. November 2026: fünf Stunden Laufzeit, Abbruch, kein Protokoll). 0 = ohne Grenze.
const BUDGET_MS = (Number.parseFloat(process.env.KEEP_ALIVE_BUDGET_MIN ?? "") || 0) * 60_000;
const startedAt = Date.now();
const overBudget = () => BUDGET_MS > 0 && Date.now() - startedAt > BUDGET_MS;
const MAX_ATTEMPTS = Math.max(1, Number.parseInt(process.env.KEEP_ALIVE_ATTEMPTS ?? "", 10) || 3);

// Playwright's default headless Chromium sets navigator.webdriver = true and
// carries an "automated" flag Chrome itself exposes - a well-known signal
// some platforms use to throttle or silently ignore actions from automated
// browsers. Manually re-testing one of the demos that consistently failed
// here (in an ordinary, non-automated browser) woke it in well under a
// minute, so this is a real candidate, not a shot in the dark - these
// settings are the standard, safe way to stop announcing "I'm a bot" for
// what is legitimately just visiting our own demos to keep them warm.
const browser = await chromium.launch({
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

// Hänger der Cloud abfangen (gemessen 2026-11-04, nicht an unseren Demos, nicht an der Last): Streamlit 1.66 lädt über 100 kleine
// Frontend-Chunks (/~/+/static/js/*.js, /-/build/assets/*.js), und jede siebte bis dritte Anfrage der Cloud-Weiterleitung bleibt 40 bis
// 60 s hängen und endet mit HTTP 500 (dieselbe Datei kommt bei der nächsten Anfrage nach 0,3 s). Ein Browser wiederholt ein fehlgeschlagenes
// Modul nicht: der App-Rahmen blieb leer, kein einziger Besuch war ein OK, die Läufe dauerten über 5 Stunden. Deshalb holt der Lauf diese
// Dateien selbst: nach ASSET_TIMEOUT_MS abbrechen, bei Zeitablauf oder 5xx bis zu ASSET_TRIES-mal neu anfragen, erst dann das Ergebnis
// an den Browser geben. WebSocket (die eigentliche Sitzung) und alle anderen Anfragen laufen unverändert.
const ASSET_TIMEOUT_MS = 8_000;
const ASSET_TRIES = 6;
await context.route(/\/(~\/\+\/static|-\/build)\//, async (route) => {
  let last = null;
  for (let i = 0; i < ASSET_TRIES; i++) {
    try {
      const res = await route.fetch({ timeout: ASSET_TIMEOUT_MS });
      if (res.status() < 500) return await route.fulfill({ response: res });
      last = res;
    } catch {
      // Zeitablauf oder Verbindungsfehler: nächster Versuch (auch wenn die Seite inzwischen geschlossen wurde, dann endet die Schleife folgenlos)
    }
  }
  try {
    if (last) await route.fulfill({ response: last });
    else await route.abort();
  } catch {
    // Seite schon geschlossen
  }
});

// Letztes Ergebnis je Adresse. Die FAIL-Zeilen gehen auf stdout (nicht stderr): `portfolio_ops` liest stdout, und im Workflow
// ist `2>&1` gesetzt, dort ändert sich nichts. Format: "FAIL <url>: skriptfehler: <erste Fehlerzeile>" bzw. "nicht-gefunden: ..." bzw.
// bei unklaren Fällen die Meldung selbst (Zeitlimit o. ä.).
const resultByUrl = new Map(urls.map((url) => [url, { ok: false, kind: "unklar", detail: "nicht besucht" }]));
let pending = [...urls];

for (let attempt = 1; attempt <= MAX_ATTEMPTS && pending.length > 0; attempt++) {
  if (attempt > 1 && overBudget()) {
    console.log(`\nZeitbudget von ${BUDGET_MS / 60_000} Minuten aufgebraucht, keine weiteren Durchgänge für ${pending.length} Demo(s).`);
    break;
  }
  const concurrency = attempt === 1 ? CONCURRENCY : 1;
  if (attempt > 1) {
    console.log(`\nAttempt ${attempt}/${MAX_ATTEMPTS}, one at a time, for ${pending.length} demo(s): ${pending.join(", ")}`);
  }
  const results = await mapWithConcurrency(pending, concurrency, (url) =>
    overBudget() ? { ok: false, kind: "unklar", detail: "nicht besucht: Zeitbudget des Laufs aufgebraucht" } : visit(context, url),
  );
  const stillFailing = [];
  pending.forEach((url, i) => {
    const result = results[i];
    resultByUrl.set(url, result);
    if (result.ok) return;
    console.log(`FAIL ${url}: ${result.kind === "unklar" ? result.detail : `${result.kind}: ${result.detail}`}`);
    // Eine sichtbare Fehlerbox bzw. eine unbekannte Adresse ändert sich beim zweiten Besuch nicht: kein erneuter Durchgang.
    if (!FINAL_KINDS.has(result.kind)) stillFailing.push(url);
  });
  pending = stillFailing;
}

await browser.close();

const failedUrls = urls.filter((url) => !resultByUrl.get(url).ok);
if (jsonOut) {
  const rows = urls.map((url) => {
    const r = resultByUrl.get(url);
    return { url, klasse: r.ok ? "ok" : r.kind, detail: r.ok ? "" : r.detail };
  });
  writeFileSync(jsonOut, JSON.stringify(rows, null, 2), "utf8");
}
console.log(`\n${urls.length - failedUrls.length}/${urls.length} demos reachable.`);
if (failedUrls.length > 0) {
  console.log(`Still failing after ${MAX_ATTEMPTS} attempts: ${failedUrls.join(", ")}`);
  process.exit(1);
}
