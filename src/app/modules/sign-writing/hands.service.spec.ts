import {TestBed} from '@angular/core/testing';
import {HandsService} from './hands.service';
import {TensorflowService} from '../../core/services/tfjs.service';
import {ThreeService} from '../../core/services/three.service';

describe('HandsService', () => {
  let service: HandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TensorflowService, ThreeService]});
    service = TestBed.inject(HandsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('model weights should not contain NaN', async () => {
    await service.loadModel();
    const model = service.leftHandSequentialModel;

    expect(model).toBeTruthy();

    const weights = await Promise.all(model.getWeights().map(w => w.data()));
    for (const weight of weights) {
      const isNaN = Boolean(service.tf.isNaN(weight).any().dataSync()[0]);
      expect(isNaN).toBeFalse();
    }
  });

  it('should normalize hands correctly', async () => {
    await Promise.all([service.tf.load(), service.three.load()]);

    const handNormalizations = [
      [
        // tslint:disable-next-line:max-line-length
        [[248.66639614105225, 297.9550790786743, -0.08617399376817048], [313.59346628189087, 319.78081941604614, 62.890407741069794], [349.8637819290161, 310.3189992904663, 104.9409145116806], [356.05104207992554, 306.42510890960693, 139.85478281974792], [354.0298342704773, 308.7967085838318, 171.05390071868896], [368.4513807296753, 211.83621287345886, 118.45286011695862], [391.60820722579956, 184.4913125038147, 179.64956641197205], [408.85960578918457, 166.19417786598206, 214.12095069885254], [418.72357845306396, 153.56018781661987, 241.38201117515564], [326.7276906967163, 189.34702157974243, 121.67787551879883], [334.95264768600464, 154.9160075187683, 211.92330718040466], [338.9851450920105, 145.05938053131104, 276.44052267074585], [340.1783061027527, 143.3175253868103, 319.86109495162964], [281.5382671356201, 184.43811058998108, 123.64041864871979], [288.3403015136719, 189.4317603111267, 214.801185131073], [288.1521964073181, 213.1494927406311, 234.93002772331238], [285.52247524261475, 227.414470911026, 237.48689651489258], [242.2289800643921, 187.8385078907013, 128.50980401039124], [246.59330368041992, 202.5400733947754, 196.4439833164215], [247.15078473091125, 223.4764289855957, 208.9101231098175], [244.32156801223755, 234.57125186920166, 211.09885573387146]],
        // tslint:disable-next-line:max-line-length
        [[0.0, 0.0, 0.0], [-53.87460867272204, -66.96863447520207, 56.796408965708935], [-73.72715283958682, -123.0910500437069, 75.20279417200432], [-67.90506838734477, -155.96881391642683, 96.28995223458003], [-57.40134100627323, -178.19614573765904, 120.84104646210801], [-50.965779993758964, -202.95828207912479, -1.509903313490213e-14], [-45.260072782063325, -278.98544696979855, 18.405850951171615], [-45.1386394307463, -325.57145063545363, 25.90184983567872], [-41.976756680249935, -359.5037258132442, 33.766177611013816], [-1.0464064364675199e-13, -199.6193245295997, -12.333907505180624], [31.975990322228963, -295.8878599646533, 22.44664078562626], [51.10130687673754, -354.78374037306935, 59.9347720675275], [63.63850727086251, -390.7021194588825, 89.44223523582745], [47.39541430043801, -182.86125824655022, -10.404736003411728], [66.17638974840436, -254.99061010637854, 58.3901382417529], [63.46550446035822, -256.24342044957825, 92.80607773270395], [61.464656345964585, -248.2688837751719, 106.9255087795864], [86.67900485407291, -166.0742098923334, -1.3322676295501878e-14], [97.22986231282657, -212.75611112692522, 60.58942546045143], [92.521597827552, -210.01652471672483, 87.09737972755666], [91.80539351622573, -203.60235428380585, 98.30312193502695]]
      ], [
        // tslint:disable-next-line:max-line-length
        [[266.67819833755493, 322.85115814208984, -0.04363307822495699], [220.46386861801147, 237.49959421157837, -6.432308048009872], [212.651225566864, 175.74850010871887, 27.4957894384861], [253.3728199005127, 150.05188155174255, 57.6715869307518], [290.9366660118103, 158.14260911941528, 97.49647510051727], [196.53551816940308, 183.21415996551514, 117.52972221374512], [180.0925350189209, 143.85282921791077, 150.1890881061554], [170.33970069885254, 121.17275738716125, 186.817076921463], [165.10530018806458, 101.94312655925751, 224.22807431221008], [232.6294367313385, 191.9170138835907, 124.57139778137207], [241.98445081710815, 147.45505690574646, 172.8555293083191], [247.0248293876648, 124.05966544151306, 195.77275156974792], [248.24022006988525, 114.18103969097137, 227.97385263442993], [267.1261944770813, 208.61302876472473, 117.41860234737396], [277.41753005981445, 168.1429328918457, 110.84358942508698], [274.5585584640503, 183.77042746543884, 73.29665148258209], [267.15885734558105, 202.62700247764587, 68.34884583950043], [300.5849003791809, 226.72553181648254, 112.3670688867569], [307.9186568260193, 195.0516927242279, 104.11798548698425], [297.57420539855957, 204.44280195236206, 80.27082800865173], [286.06309032440186, 217.2321858406067, 73.97288680076599]],
        // tslint:disable-next-line:max-line-length
        [[0.0, 0.0, 0.0], [-54.479260198097805, -71.11846055086438, 58.17594848846076], [-54.39223415540774, -145.6437901306979, 78.54576783252529], [-3.545339962524018, -179.63888643031996, 87.61257240473797], [49.14794301931342, -194.95344154721718, 62.06021751253273], [-40.09854676422485, -208.82027169070966, 5.551115123125783e-16], [-48.13049962464756, -266.6680014062149, 1.3281840284453539], [-47.00941869901266, -313.07001717228695, -11.447169097370368], [-40.773818965790895, -356.4530129101176, -26.203968571403916], [9.134429734859657e-15, -199.99294837298712, -1.6794645217193471], [23.603763878904314, -268.1038602115065, -0.7067006484911872], [35.301688782987696, -302.1004761871728, 1.720669069409734], [46.93353477547328, -333.09716362043764, -14.541999919797409], [34.07355106941323, -174.87454913669825, 0.6581788197466907], [40.2663401403231, -199.59555645909575, 40.242655464274804], [25.438899509841193, -160.53426324779335, 55.575838830821], [17.1508731893172, -143.6797255930755, 42.43293329268436], [67.86518085896179, -150.39315561348292, 9.103828801926284e-15], [70.91657215646, -167.61675658262482, 33.11742629384811], [52.6709032860349, -144.92204539941508, 40.80547628453034], [39.35404239471322, -132.63262286274133, 32.23603583001071]]
      ], [
        // tslint:disable-next-line:max-line-length
        [[2.60705627e+02, 3.37643646e+02, -9.28593054e-02], [2.10784332e+02, 3.16998627e+02, -8.27554855e+01], [1.93835342e+02, 2.66705475e+02, -1.24799034e+02], [2.35526871e+02, 2.17327255e+02, -1.48760818e+02], [2.75498596e+02, 1.88349747e+02, -1.49933273e+02], [1.71491211e+02, 1.91392395e+02, -5.14710464e+01], [1.61075333e+02, 1.05774673e+02, -1.07832794e+02], [1.63360901e+02, 5.55294151e+01, -1.40600769e+02], [1.73754684e+02, 1.11177626e+01, -1.57216080e+02], [2.14831955e+02, 1.99762024e+02, -4.13048630e+01], [2.44172714e+02, 1.61405777e+02, -1.30912308e+02], [2.38794632e+02, 2.27534744e+02, -1.27142723e+02], [2.19911545e+02, 2.51557541e+02, -8.53535767e+01], [2.56865509e+02, 2.13906311e+02, -4.56171799e+01], [2.84798065e+02, 1.86186142e+02, -1.37561310e+02], [2.69117950e+02, 2.45126968e+02, -1.31283600e+02], [2.48432770e+02, 2.59336426e+02, -9.20293350e+01], [2.92065948e+02, 2.32734634e+02, -5.88568840e+01], [3.13212036e+02, 2.08028992e+02, -1.22773369e+02], [2.95430847e+02, 2.51139603e+02, -1.24858963e+02], [2.76066742e+02, 2.66142792e+02, -9.79688110e+01]],
        // tslint:disable-next-line:max-line-length
        [[0.00000000e+00, 0.00000000e+00, 0.00000000e+00], [-2.05852102e+01, -8.43542239e+01, 9.97880671e+01], [-9.51636170e+00, -1.69808429e+02, 1.25001397e+02], [6.54616798e+01, -2.20523798e+02, 1.13256765e+02], [1.23026573e+02, -2.37556703e+02, 8.68171243e+01], [-4.64094101e+01, -2.32186465e+02, -1.82238355e-06], [-1.13881838e+01, -3.62578954e+02, 1.98150407e+01], [1.93110838e+01, -4.35353543e+02, 2.87847134e+01], [5.15110440e+01, -4.90263213e+02, 1.97556152e+01], [2.06700921e-14, -1.99093220e+02, -1.90234006e+01], [8.43045340e+01, -2.73281319e+02, 5.70360486e+01], [5.75141926e+01, -1.97081808e+02, 9.26397117e+01], [1.01073372e+01, -1.57595191e+02, 6.21706932e+01], [4.92581982e+01, -1.66689775e+02, -1.71154620e+01], [1.29823974e+02, -2.30243201e+02, 6.83153915e+01], [9.14003112e+01, -1.65618917e+02, 9.95540985e+01], [4.56163097e+01, -1.39487004e+02, 6.68586078e+01], [9.25816015e+01, -1.35992949e+02, 2.44384259e-06], [1.52234167e+02, -1.85738665e+02, 5.57429433e+01], [1.19207937e+02, -1.44327761e+02, 8.82483889e+01], [8.00046381e+01, -1.22540409e+02, 7.03460515e+01]]        // [[0, 0, 0], [20.585208892822266, -84.35421752929688, 99.78807067871094], [9.516349792480469, -169.8084259033203, 125.00139617919922], [-65.46167755126953, -220.5238037109375, 113.25675964355469], [-123.02657318115234, -237.55673217773438, 86.81712341308594], [46.4094123840332, -232.18646240234375, 0.0000024781415959296282], [11.388175964355469, -362.5789794921875, 19.815040588378906], [-19.31108856201172, -435.3535461425781, 28.784713745117188], [-51.51103591918945, -490.2632141113281, 19.755617141723633], [0.000005467426944960607, -199.0932159423828, -19.023399353027344], [-84.30452728271484, -273.28131103515625, 57.03604507446289], [-57.514190673828125, -197.08181762695312, 92.63970947265625], [-10.107339859008789, -157.59518432617188, 62.17069625854492], [-49.2581901550293, -166.6897735595703, -17.11546516418457], [-129.823974609375, -230.24317932128906, 68.31538391113281], [-91.40030670166016, -165.61891174316406, 99.55410766601562], [-45.61631393432617, -139.4870147705078, 66.85861206054688], [-92.58159637451172, -135.99295043945312, 6.722572152284556e-7], [-152.23416137695312, -185.73866271972656, 55.742942810058594], [-119.20793914794922, -144.3277587890625, 88.2483901977539], [-80.00463104248047, -122.54041290283203, 70.3460464477539]]
      ]
    ];

    for (const [x, y] of handNormalizations) {
      const vectors = x.map(v => new service.three.Vector3(v[0], v[1], v[2]));
      const normal = service.normal(vectors); // TODO maybe need to flip normal?
      const yHat = service.normalizeHand(vectors, normal, false).arraySync();
      // This is evaluated one item at a time because of negative zeros
      for (let i = 0; i < y.length; i++) {
        for (let j = 0; j < 3; j++) {
          const yRound = Number(y[i][j].toFixed(2));
          const yHatRound = Number(yHat[i][j].toFixed(2));
          if (yRound !== 0 || yHatRound !== 0) { // Don't evaluate case of 0 vs -0
            expect(yHatRound).toEqual(yRound);
          }
        }
      }
    }
  });

  it('should find angle rotation bucket for representative points', () => {
    expect(service.angleRotationBucket(45 * 0)).toBe(0);
    expect(service.angleRotationBucket(45 * 1)).toBe(1);
    expect(service.angleRotationBucket(45 * 2)).toBe(2);
    expect(service.angleRotationBucket(45 * 3)).toBe(3);
    expect(service.angleRotationBucket(45 * 4)).toBe(4);
    expect(service.angleRotationBucket(45 * 5)).toBe(5);
    expect(service.angleRotationBucket(45 * 6)).toBe(6);
    expect(service.angleRotationBucket(45 * 7)).toBe(7);
    expect(service.angleRotationBucket(45 * 8)).toBe(0);
  });
});



