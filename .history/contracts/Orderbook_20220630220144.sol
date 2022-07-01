// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OrderBook is ReentrancyGuard {
    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0)œ, "First arg token address invalid");
        require(_tokenA != address(0), "Second arg token address invalid");

        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    address tokenA;
    address tokenB;

    using SafeMathUpgradeable for uint256;

    struct Order {
        address maker;
        address makeAsset;
        uint256 makeAmount;
        address taker;
        address takeAsset;
        uint256 takeAmount;
        uint256 salt;
        uint256 startBlock;
        uint256 endBlock;
    }

    enum Action {
        CREATE,
        FULFILL,
        PARTIALFILL,
        CANCEL
    }

    uint256 public orderId; //should not be public
    mapping(uint256 => Order) public orders; //como llamo esto chequeando si no esta' vacio cuando public es un metodo que no acepta parametros?

    event OrderEvent(
        Action indexed action,
        address indexed maker,
        address indexed taker,
        uint256 id,
        Order _order
    );

    function _getNextOrderId() internal returns (uint256 _orderId) {
        _orderId = orderId;
        orderId++;
    }

    function createOrder(
        //makeOrder
        uint256 makeAmount,
        address makeAsset,
        uint256 takeAmount,
        address takeAsset
    ) public returns (uint256 _id) {
        require(makeAmount > 0);
        require(takeAmount > 0);
        require(makeAsset != address(0));
        require(takeAsset != address(0));
        require(
            (makeAsset == tokenA && takeAsset == tokenB) ||
                (takeAsset == tokenA && makeAsset == tokenB)
        );

        require(
            IERC20Upgradeable(makeAsset).transferFrom(
                msg.sender,
                address(this),
                makeAmount
            ),
            "Asset balance insufficient"
        );

        // write order directly to storage. //this should be refactored
        _id = _getNextOrderId();
        Order storage _order = orders[_id];
        _order.maker = msg.sender;
        _order.makeAsset = makeAsset;
        _order.makeAmount = makeAmount;
        _order.takeAsset = takeAsset;
        _order.takeAmount = takeAmount;
        _order.startBlock = block.number;

        emit OrderEvent(Action.CREATE, _order.maker, _order.taker, _id, _order);
    }

    function takeOrder(
        uint256 _id,
        address _takeAsset,
        uint256 _takeAmount
    ) public nonReentrant returns (uint256 amountBought) {
        Order storage _order = orders[_id];
        require(_takeAmount > 0);
        require(_order.takeAsset == _takeAsset, "Asset is invalid");
        require(
            _order.takeAmount < _takeAmount,
            "Send amount exceeds order amount"
        );
        bool isPartialFill = _order.takeAmount != _takeAmount;
        uint256 _amountToTransfer = isPartialFill
            ? (_order.makeAmount * _takeAmount) / _order.takeAmount
            : _order.makeAmount;
        require(
            IERC20Upgradeable(_takeAsset).transferFrom(
                msg.sender,
                _order.maker,
                _takeAmount
            ),
            "Asset balance insufficient"
        );
        require(
            IERC20Upgradeable(_order.makeAsset).transferFrom(
                address(this),
                msg.sender,
                _amountToTransfer
            ),
            "Asset balance insufficient"
        );

        if (isPartialFill) {
            emit OrderEvent(
                Action.PARTIALFILL,
                _order.maker,
                _order.taker,
                _id,
                _order
            );
        } else {
            emit OrderEvent(
                Action.FULFILL,
                _order.maker,
                _order.taker,
                _id,
                _order
            );
        }
        delete orders[_id];
        amountBought = _amountToTransfer;
    }

    function cancelOrder(uint256 _id)
        public
        nonReentrant
        returns (bool success)
    {
        Order memory _order = orders[_id];
        require(
            IERC20Upgradeable(_order.makeAsset).transfer(
                _order.maker,
                _order.makeAmount
            ),
            "refund failed"
        );

        delete orders[_id];

        emit OrderEvent(Action.CANCEL, _order.maker, _order.taker, _id, _order);
        return true;
    }
}
